import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { db } from "@/lib/db"
import { captureException } from "@sentry/nextjs"
import Google from "next-auth/providers/google"
import Facebook from "next-auth/providers/facebook"
import Apple from "next-auth/providers/apple"
import { getPushPressCustomerByEmail, createNewCustomer } from "@/lib/pushpress"

export const { handlers, signIn, signOut, auth } = NextAuth({
    adapter: PrismaAdapter(db),
    session: { strategy: "jwt" },
    pages: {
        signIn: "/login",
    },
    providers: [
        Google,
        Facebook,
        Apple,
    ],
    logger: {
        error(message) {
            captureException(message)
        }
    },
    trustHost: true,
    callbacks: {
        async signIn({ user }) {
            if (!user.email) return false;

            try {
                // We'll sync with PushPress here. 
                // Since this is Auth.js with an adapter, the user might not be in the DB yet if it's the first time.
                // But we can check PushPress anyway.

                const existingUser = await db.user.findUnique({
                    where: { email: user.email }
                });

                if (!existingUser || !existingUser.pushPressId) {
                    let ppCustomer = await getPushPressCustomerByEmail(user.email);

                    if (!ppCustomer) {
                        const nameParts = user.name?.split(' ') || [];
                        ppCustomer = await createNewCustomer({
                            name: {
                                first: nameParts[0] || 'User',
                                last: nameParts.slice(1).join(' ') || 'Social'
                            },
                            email: user.email,
                            role: 'member'
                        });
                    }

                    // If user exists in DB but has no pushPressId, update it
                    if (existingUser && ppCustomer) {
                        await db.user.update({
                            where: { id: existingUser.id },
                            data: { pushPressId: ppCustomer.id }
                        });
                    }
                    // If user doesn't exist yet, the adapter will create it after this callback.
                    // We can't easily set the pushPressId for the new user here unless we use events or custom adapter.
                    // However, we can use events.createUser below.
                }

                return true;
            } catch (error) {
                captureException(error);
                return true; // Still allow login, maybe sync later
            }
        },
        async session({ session, token }) {
            if (token.sub && session.user) {
                session.user.id = token.sub
            }
            return session
        },
        async jwt({ token }) {
            return token
        }
    },
    events: {
        async createUser({ user }) {
            // This is called when a new user is created in the DB by the adapter
            if (user.email) {
                const ppCustomer = await getPushPressCustomerByEmail(user.email);
                if (ppCustomer) {
                    await db.user.update({
                        where: { id: user.id },
                        data: { pushPressId: ppCustomer.id }
                    });
                } else {
                    const nameParts = user.name?.split(' ') || [];
                    const newPpCustomer = await createNewCustomer({
                        name: {
                            first: nameParts[0] || 'User',
                            last: nameParts.slice(1).join(' ') || 'Social'
                        },
                        email: user.email,
                        role: 'member'
                    });
                    if (newPpCustomer) {
                        await db.user.update({
                            where: { id: user.id },
                            data: { pushPressId: newPpCustomer.id }
                        });
                    }
                }
            }
        }
    },
})
