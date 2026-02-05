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
            // Simply allow sign in if email exists. 
            // The adapter will handle user lookup/creation.
            return !!user.email;
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
