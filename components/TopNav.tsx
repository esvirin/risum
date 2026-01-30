"use client";

import Link from "next/link";
import { signOut } from "next-auth/react";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

export default function TopNav({ user }: { user: any }) {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);

    const isActive = (path: string) => pathname === path;

    const navLinks = [
        { href: "/cabinet", label: "Dashboard" },
        { href: "/cabinet/schedule", label: "Schedule" },
    ];

    return (
        <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="w-full max-w-7xl mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
                {/* Logo */}
                <div className="flex items-center gap-2">
                    <Link href="/" className="text-xl font-bold text-primary tracking-tight">
                        Fit Space
                    </Link>
                </div>

                {/* Desktop Navigation */}
                <div className="hidden md:flex gap-8 items-center">
                    {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={cn(
                                "text-sm font-medium transition-colors hover:text-primary",
                                isActive(link.href) ? "text-foreground" : "text-muted-foreground"
                            )}>
                            {link.label}
                        </Link>
                    ))}
                </div>

                {/* Desktop User Actions */}
                <div className="hidden md:flex items-center gap-4">
                    <span className="text-sm text-muted-foreground">{user.name}</span>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => signOut({ callbackUrl: "/login" })}
                    >
                        Sign Out
                    </Button>
                </div>

                {/* Mobile Menu Trigger */}
                <Sheet open={isOpen} onOpenChange={setIsOpen}>
                    <SheetTrigger asChild className="md:hidden">
                        <Button variant="ghost" size="icon" aria-label="Menu">
                            <Menu className="h-6 w-6" />
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                        <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
                        <div className="flex flex-col gap-6 mt-6">
                            <div className="flex flex-col gap-4">
                                <h3 className="font-semibold text-lg border-b pb-2">Menu</h3>
                                {navLinks.map((link) => (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        onClick={() => setIsOpen(false)}
                                        className={cn(
                                            "text-lg font-medium transition-colors hover:text-primary py-2",
                                            isActive(link.href) ? "text-foreground" : "text-muted-foreground"
                                        )}>
                                        {link.label}
                                    </Link>
                                ))}
                            </div>

                            <div className="flex flex-col gap-4 pt-4 border-t">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium">Logged in as</span>
                                    <span className="text-sm text-muted-foreground">{user.name}</span>
                                </div>
                                <Button
                                    variant="outline"
                                    className="w-full justify-start text-destructive hover:text-destructive"
                                    onClick={() => {
                                        setIsOpen(false);
                                        signOut({ callbackUrl: "/login" });
                                    }}
                                >
                                    Sign Out
                                </Button>
                            </div>
                        </div>
                    </SheetContent>
                </Sheet>
            </div>
        </nav>
    );
}
