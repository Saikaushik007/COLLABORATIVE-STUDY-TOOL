"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { BookOpen, Users, LayoutDashboard, LogIn, Sparkles } from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";

export const Navbar = () => {
    const pathname = usePathname();
    const { user } = useAuthStore();

    const navLinks = [
        { name: "Features", href: "/#features", icon: BookOpen },
        { name: "Discovery", href: "/discovery", icon: Users },
    ];

    return (
        <nav className="fixed top-6 left-0 right-0 z-50 pointer-events-none">
            <div className="container mx-auto px-4">
                <div className="max-w-5xl mx-auto flex items-center justify-between h-20 px-8 rounded-2xl bg-background/60 backdrop-blur-2xl border border-white/10 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.5)] pointer-events-auto">
                    <Link href="/" className="flex items-center gap-3 group">
                        <div className="w-11 h-11 bg-gradient-to-br from-primary via-primary to-purple-600 rounded-xl flex items-center justify-center group-hover:rotate-12 transition-all shadow-[0_0_20px_rgba(var(--color-primary),0.3)]">
                            <Sparkles className="text-white w-6 h-6 fill-current" />
                        </div>
                        <span className="text-2xl font-black font-outfit tracking-tighter text-white">
                            Study<span className="text-primary italic">Hub</span>
                        </span>
                    </Link>

                    {/* Desktop Nav */}
                    <div className="hidden md:flex items-center gap-10">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                className="relative text-sm font-bold text-muted-foreground hover:text-white transition-colors uppercase tracking-widest group"
                            >
                                {link.name}
                                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full" />
                            </Link>
                        ))}
                    </div>

                    <div className="flex items-center gap-6">
                        {user ? (
                            <Link
                                href="/dashboard"
                                className="group flex items-center gap-2 px-6 py-3 bg-white/5 border border-white/10 text-white rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all shadow-lg"
                            >
                                <LayoutDashboard size={14} className="group-hover:rotate-6 transition-transform" />
                                My Dashboard
                            </Link>
                        ) : (
                            <>
                                <Link
                                    href="/login"
                                    className="hidden sm:block text-xs font-bold text-muted-foreground hover:text-white transition-colors uppercase tracking-widest"
                                >
                                    Log In
                                </Link>
                                <Link
                                    href="/register"
                                    className="px-6 py-3 bg-primary text-primary-foreground rounded-xl text-xs font-black uppercase tracking-[0.1em] shadow-[0_10px_20px_-5px_rgba(var(--color-primary),0.5)] hover:scale-105 active:scale-95 transition-all"
                                >
                                    Join Elite Space
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};
