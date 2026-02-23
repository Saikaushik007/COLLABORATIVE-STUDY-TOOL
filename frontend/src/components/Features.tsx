"use client";

import { motion } from "framer-motion";
import { MessageSquare, MousePointer2, Timer, BookOpen, Trophy, Cpu, Zap, Share2, Target } from "lucide-react";

const features = [
    {
        title: "AI Study Assistant",
        description: "In-room AI that summarizes discussions, explains complex topics, and answers questions instantly.",
        icon: Cpu,
        color: "text-primary",
        bg: "bg-primary/10",
    },
    {
        title: "Whiteboard 2.0",
        description: "Shared workspace with sticky notes, shapes, and diagram tools. Export as PDF with one click.",
        icon: MousePointer2,
        color: "text-emerald-400",
        bg: "bg-emerald-400/10",
    },
    {
        title: "Synced Productivity",
        description: "Group Pomodoro timers synced across all participants. Stay in the zone together.",
        icon: Timer,
        color: "text-amber-400",
        bg: "bg-amber-400/10",
    },
    {
        title: "Knowledge Vault",
        description: "Deep-dive into shared resources, flashcards, and session intel powered by synced collaboration.",
        icon: BookOpen,
        color: "text-blue-400",
        bg: "bg-blue-400/10",
    },
    {
        title: "Focus Radar",
        description: "Track your study streaks, earn badges, and climb the global leaderboards with real-time stats.",
        icon: Trophy,
        color: "text-purple-400",
        bg: "bg-purple-400/10",
    },
    {
        title: "Smart Scheduler",
        description: "Book study sessions, send automated reminders, and plan your academic calendar effortlessly.",
        icon: Target,
        color: "text-rose-400",
        bg: "bg-rose-400/10",
    },
];

export const Features = () => {
    return (
        <section id="features" className="py-32 bg-background relative overflow-hidden">
            <div className="absolute top-1/2 left-0 w-96 h-96 bg-primary/5 rounded-full blur-[120px] -translate-x-1/2" />

            <div className="container mx-auto px-4 relative z-10">
                <div className="text-center mb-24">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-4xl md:text-6xl font-black font-outfit mb-6 tracking-tight">
                            Tools for the <span className="text-primary italic">Modern Hub</span>
                        </h2>
                        <p className="text-muted-foreground max-w-2xl mx-auto text-lg leading-relaxed">
                            We've unified the best of Discord, Notion, and Zoom into a high-octane
                            workspace built specifically for deep work.
                        </p>
                    </motion.div>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {features.map((feature, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            whileHover={{ y: -10 }}
                            className="relative group p-10 bg-card border border-white/5 rounded-[2.5rem] hover:border-primary/50 transition-all duration-500 overflow-hidden"
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                            <div className={`${feature.bg} w-16 h-16 rounded-3xl flex items-center justify-center mb-8 shadow-inner transition-transform group-hover:scale-110 group-hover:rotate-6`}>
                                <feature.icon className={`${feature.color} w-8 h-8`} />
                            </div>

                            <h3 className="text-2xl font-bold mb-4 font-outfit text-white group-hover:text-primary transition-colors">{feature.title}</h3>
                            <p className="text-muted-foreground leading-relaxed text-[15px]">
                                {feature.description}
                            </p>

                            <div className="mt-8 pt-6 border-t border-white/5 flex items-center gap-2 text-primary opacity-0 group-hover:opacity-100 transition-all translate-y-4 group-hover:translate-y-0 text-xs font-bold uppercase tracking-widest">
                                Discover more <ArrowRight size={14} />
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

const ArrowRight = ({ size }: { size: number }) => (
    <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <path d="M5 12h14m-7-7 7 7-7 7" />
    </svg>
);
