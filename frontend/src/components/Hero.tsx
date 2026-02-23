"use client";

import { motion } from "framer-motion";
import { Zap, ArrowRight, Play, Rocket, Shield, Globe } from "lucide-react";
import Link from "next/link";

export const Hero = () => {
    return (
        <section className="relative pt-40 pb-32 overflow-hidden bg-background">
            {/* Cinematic Background Elements */}
            <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/10 rounded-full blur-[150px] -mr-96 -mt-96 animate-pulse" />
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[150px] -ml-72 -mb-72" />
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-50 contrast-150" />

            <div className="container mx-auto px-4 relative z-10">
                <div className="grid lg:grid-cols-2 gap-16 items-center">
                    {/* Hero Text Content */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-[0.2em] mb-8">
                            <Rocket size={14} className="animate-bounce" />
                            Next Gen Collaborative Study
                        </div>

                        <h1 className="text-6xl md:text-8xl font-black font-outfit mb-8 tracking-tight leading-[0.9]">
                            Level Up <br />
                            <span className="text-white drop-shadow-[0_0_30px_rgba(255,255,255,0.2)]">Your Study</span> <br />
                            <span className="text-primary italic">Together.</span>
                        </h1>

                        <p className="text-xl text-muted-foreground/80 max-w-xl mb-12 leading-relaxed font-outfit">
                            The ultimate digital workspace where students collaborate in real-time.
                            AI-powered summaries, synced Pomodoro, and global study rooms designed to beat
                            Zoom and Discord.
                        </p>

                        <div className="flex flex-wrap gap-6">
                            <Link
                                href="/register"
                                className="group relative px-8 py-5 bg-primary text-primary-foreground rounded-2xl font-bold flex items-center gap-3 overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-[0_15px_30px_-10px_rgba(var(--color-primary),0.5)]"
                            >
                                <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500" />
                                Launch StudyHub
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </Link>

                            <Link
                                href="/#features"
                                className="px-8 py-5 bg-white/5 border border-white/10 text-white rounded-2xl font-bold flex items-center gap-3 hover:bg-white/10 transition-all backdrop-blur-md"
                            >
                                <Play size={18} className="fill-white" />
                                Watch Demo
                            </Link>
                        </div>

                        {/* Social Proof Bits */}
                        <div className="mt-16 pt-8 border-t border-white/5 flex flex-wrap gap-8 items-center opacity-60">
                            <div className="flex items-center gap-2">
                                <Shield className="text-primary" size={16} />
                                <span className="text-xs font-bold uppercase tracking-widest">Secure & Scalable</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Globe className="text-emerald-400" size={16} />
                                <span className="text-xs font-bold uppercase tracking-widest">Global Community</span>
                            </div>
                            <div className="flex items-center gap-2 text-primary">
                                <Zap size={16} fill="currentColor" />
                                <span className="text-xs font-bold uppercase tracking-widest">Real-time Sync</span>
                            </div>
                        </div>
                    </motion.div>

                    {/* Immersive Dashboard Preview Card */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, rotateY: -10 }}
                        animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                        transition={{ duration: 1, delay: 0.2 }}
                        className="hidden lg:block perspective-2000"
                    >
                        <div className="relative p-2 bg-gradient-to-br from-primary/30 to-purple-600/30 rounded-[3rem] shadow-2xl backdrop-blur-2xl ring-1 ring-white/10 group">
                            <div className="bg-background rounded-[2.5rem] overflow-hidden border border-white/5 shadow-inner">
                                {/* Synthetic UI Content */}
                                <div className="p-8 aspect-[4/3] flex flex-col gap-6">
                                    <div className="flex justify-between items-center mb-4">
                                        <div className="h-8 w-40 bg-white/5 rounded-full animate-pulse" />
                                        <div className="w-12 h-12 bg-primary/20 rounded-2xl" />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="h-32 bg-white/5 rounded-3xl p-6 flex flex-col justify-end">
                                            <div className="w-10 h-10 bg-primary/30 rounded-full mb-4" />
                                            <div className="h-4 w-20 bg-white/10 rounded-full mb-2" />
                                            <div className="h-6 w-full bg-white/20 rounded-full" />
                                        </div>
                                        <div className="h-32 bg-white/5 rounded-3xl p-6 flex flex-col justify-end">
                                            <div className="w-10 h-10 bg-emerald-400/30 rounded-full mb-4" />
                                            <div className="h-4 w-20 bg-white/10 rounded-full mb-2" />
                                            <div className="h-6 w-full bg-white/20 rounded-full" />
                                        </div>
                                    </div>
                                    <div className="flex-1 bg-white/[0.02] rounded-3xl border border-white/5 p-6 space-y-4">
                                        <div className="flex gap-4">
                                            <div className="w-12 h-12 rounded-full bg-primary/10" />
                                            <div className="flex-1 space-y-2 py-1">
                                                <div className="h-3 w-1/4 bg-white/10 rounded-full" />
                                                <div className="h-4 w-full bg-white/5 rounded-full" />
                                            </div>
                                        </div>
                                        <div className="flex gap-4 justify-end">
                                            <div className="flex-1 space-y-2 py-1">
                                                <div className="h-3 w-1/4 bg-white/10 rounded-full ml-auto" />
                                                <div className="h-4 w-full bg-primary/10 rounded-full" />
                                            </div>
                                            <div className="w-12 h-12 rounded-full bg-primary/20" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Decorative Floating Elements */}
                            <motion.div
                                animate={{ y: [0, -20, 0] }}
                                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                className="absolute -top-10 -right-10 w-24 h-24 bg-card border rounded-3xl shadow-premium flex items-center justify-center backdrop-blur-xl transition-transform hover:scale-110"
                            >
                                <Zap className="text-primary w-10 h-10 fill-current" />
                            </motion.div>

                            <motion.div
                                animate={{ y: [0, 20, 0] }}
                                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                                className="absolute -bottom-10 -left-10 p-4 bg-emerald-400/10 border border-emerald-400/20 rounded-2xl shadow-premium backdrop-blur-xl"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-2 h-2 bg-emerald-400 rounded-full animate-ping" />
                                    <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">Real-time active</span>
                                </div>
                            </motion.div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};
