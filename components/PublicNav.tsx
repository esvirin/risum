"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export function PublicNav() {
    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-14 max-w-screen-2xl items-center justify-between">
                <Link href="/" className="text-xl font-bold tracking-tight text-zinc-900">
                    Fit Space
                </Link>
                <div className="flex items-center gap-4">
                    <Button asChild variant="ghost">
                        <Link href="/login">Member Login</Link>
                    </Button>
                    <Button asChild>
                        <Link href="/register">Book a Class</Link>
                    </Button>
                </div>
            </div>
        </header>
    );
}
