import { db } from "@/lib/db";
import { createNewCustomer, getPushPressCustomerByEmail } from "@/lib/pushpress";
import { captureException } from "@sentry/nextjs";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { z } from "zod";

const RegisterSchema = z.object({
    first: z.string(),
    last: z.string(),
    email: z.string().email(),
    password: z.string().min(6),
});

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const validation = RegisterSchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json({ error: "Invalid input" }, { status: 400 });
        }

        const { email, password, first, last } = validation.data;

        // 1. Check if user already exists in LOCAL DB
        const existingUser = await db.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            return NextResponse.json(
                { error: "User already registered. Please login." },
                { status: 409 }
            );
        }

        // 2. Verify user exists in PUSHPRESS
        let customer = await getPushPressCustomerByEmail(email);

        if (!customer) {
            const newCustomer = await createNewCustomer({ email, name: { first, last, nickname: first } });
            console.log(newCustomer)
            if (!newCustomer) {
                return NextResponse.json(
                    { error: "Failed to create user in PushPress" },
                    { status: 500 }
                );
            }
            customer = newCustomer;
        }

        // 3. Create local user linked to PushPress ID
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await db.user.create({
            data: {
                email,
                password: hashedPassword,
                name: `${customer.name.first} ${customer.name.last}`,
                pushPressId: customer.id,
                emailVerified: new Date(), // Trusted from PushPress
            },
        });

        // Remove password from response
        const { password: _, ...userWithoutPassword } = newUser;

        return NextResponse.json({ user: userWithoutPassword }, { status: 201 });

    } catch (error) {
        console.log(error)
        captureException(error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
