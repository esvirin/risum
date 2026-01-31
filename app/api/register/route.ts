import { db } from "@/lib/db";
import { getPushPressMemberByEmail } from "@/lib/pushpress";
import { captureException } from "@sentry/nextjs";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { z } from "zod";

const RegisterSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
    name: z.string().optional(),
});

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const validation = RegisterSchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json({ error: "Invalid input" }, { status: 400 });
        }

        const { email, password, name } = validation.data;

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
        const ppMember = await getPushPressMemberByEmail(email);

        if (!ppMember) {
            return NextResponse.json(
                { error: "Email not found in our membership database. Please contact support." },
                { status: 404 }
            );
        }

        // 3. Create local user linked to PushPress ID
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await db.user.create({
            data: {
                email,
                password: hashedPassword,
                name: name || `${ppMember.firstName} ${ppMember.lastName}`,
                pushPressId: ppMember.id,
                emailVerified: new Date(), // Trusted from PushPress
            },
        });

        // Remove password from response
        const { password: _, ...userWithoutPassword } = newUser;

        return NextResponse.json({ user: userWithoutPassword }, { status: 201 });

    } catch (error) {
        captureException(error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
