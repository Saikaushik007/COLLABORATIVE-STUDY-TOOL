"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
    Trophy,
    ShieldCheck,
    Zap,
    Clock,
    Calendar,
    ArrowLeft,
    TrendingUp,
    Star,
    Award,
    Lock as LockIcon
} from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import Link from "next/link";

export default function ProfilePage() {
    const { id: userId } = useParams();
    const { user, token } = useAuthStore();
    const [profile, setProfile] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        if (!token) {
            router.push("/login");
            return;
        }

        const fetchProfile = async () => {
            try {
                // Fetch specific user stats
                const res = await fetch(`http://localhost:5000/api/gamification/stats`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const data = await res.json();
                setProfile(data);
            } catch (err) {
                console.error("Failed to fetch profile", err);
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [userId, token, router]);

    if (loading) return <div className="min-h-screen bg-background flex items-center justify-center"><Zap className="animate-spin text-primary" size={48} /></div>;
    if (!profile) return null;

    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col items-center">
            {/* Minimalist Profile Nav */}
            <div className="w-full max-w-7xl px-8 py-8 flex items-center justify-between">
                <button onClick={() => router.back()} className="flex items-center gap-2 text-muted-foreground hover:text-white transition-all group">
                    <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Return</span>
                </button>
            </div>

            <main className="w-full max-w-6xl px-8 pb-20">
                {/* Profile Header Card */}
                <section className="bg-card border border-white/5 rounded-[4rem] p-12 mb-12 relative overflow-hidden shadow-premium">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2" />

                    <div className="relative z-10 flex flex-col md:flex-row items-center gap-12 text-center md:text-left">
                        <div className="relative">
                            <div className="w-48 h-48 bg-gradient-to-br from-primary to-purple-600 rounded-[3rem] p-1.5 rotate-3 shadow-2xl">
                                <div className="w-full h-full bg-card rounded-[2.8rem] flex items-center justify-center overflow-hidden">
                                    <span className="text-6xl font-black text-primary">{user?.name ? user.name[0].toUpperCase() : "S"}</span>
                                </div>
                            </div>
                            <div className="absolute -bottom-2 -right-2 w-16 h-16 bg-white border-8 border-card rounded-full flex items-center justify-center">
                                <Trophy size={24} className="text-yellow-500" />
                            </div>
                        </div>

                        <div className="flex-1">
                            <h1 className="text-5xl font-black font-outfit uppercase tracking-tighter mb-2">{user?.name || "Study Master"}</h1>
                            <p className="text-primary font-bold uppercase tracking-[0.3em] text-xs mb-8">Elite Scholar • Rank #1 Weekly</p>

                            <div className="flex flex-wrap gap-6 justify-center md:justify-start">
                                <div className="flex items-center gap-3 px-6 py-3 bg-white/5 rounded-2xl border border-white/5">
                                    <ShieldCheck className="text-purple-400" size={20} />
                                    <span className="text-sm font-black uppercase tracking-widest">Level {profile.level}</span>
                                </div>
                                <div className="flex items-center gap-3 px-6 py-3 bg-primary/10 text-primary rounded-2xl border border-primary/20">
                                    <Zap size={20} className="fill-current" />
                                    <span className="text-sm font-black uppercase tracking-widest">{profile.points} XP Total</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <div className="grid lg:grid-cols-3 gap-12">
                    {/* Stats Radar Column */}
                    <div className="lg:col-span-1 space-y-12">
                        <section className="p-8 bg-card border border-white/5 rounded-[2.5rem] shadow-premium">
                            <h3 className="text-xs font-black uppercase tracking-widest opacity-40 mb-8 flex items-center gap-2">
                                <TrendingUp size={16} className="text-primary" />
                                Achievement Pulse
                            </h3>
                            <div className="space-y-6">
                                {[
                                    { label: "Focus Streak", value: `${profile.stats?.focusStreak || 0} Days`, icon: Zap, color: "text-amber-400" },
                                    { label: "Hours Logged", value: `${profile.stats?.studyHours || 0}h`, icon: Clock, color: "text-emerald-400" },
                                    { label: "Nodes Joined", value: `${profile.stats?.roomsJoined || 0}`, icon: Calendar, color: "text-primary" },
                                ].map((stat, i) => (
                                    <div key={i} className="flex items-center justify-between group">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center">
                                                <stat.icon size={18} className={stat.color} />
                                            </div>
                                            <span className="text-xs font-bold uppercase opacity-60 group-hover:opacity-100 transition-opacity">{stat.label}</span>
                                        </div>
                                        <span className="text-lg font-black font-outfit">{stat.value}</span>
                                    </div>
                                ))}
                            </div>
                        </section>

                        <section className="p-8 bg-card border border-white/5 rounded-[2.5rem] shadow-premium overflow-hidden relative">
                            <Star className="absolute -top-4 -right-4 text-primary/5" size={120} />
                            <h3 className="text-xs font-black uppercase tracking-widest opacity-40 mb-8">Rarest Badge</h3>
                            <div className="flex flex-col items-center text-center">
                                <div className="w-24 h-24 bg-primary/20 rounded-[2rem] flex items-center justify-center mb-6 shadow-glow">
                                    <Award size={48} className="text-primary animate-float" />
                                </div>
                                <h4 className="text-xl font-bold font-outfit uppercase tracking-tight mb-2">Architect of Deep Work</h4>
                                <p className="text-[10px] uppercase font-black tracking-widest opacity-40 underline decoration-primary decoration-4">Unlocked Jan 2026</p>
                            </div>
                        </section>
                    </div>

                    {/* Badge Collection Column */}
                    <div className="lg:col-span-2 space-y-12">
                        <section className="p-12 bg-card border border-white/5 rounded-[3rem] shadow-premium">
                            <div className="flex items-center justify-between mb-12">
                                <h3 className="text-2xl font-black font-outfit uppercase tracking-tight">Badge Collection</h3>
                                <span className="text-[10px] font-black uppercase tracking-widest opacity-40 underline">{profile.badges?.length || 0} Medals</span>
                            </div>

                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
                                {profile.badges?.map((badge: any) => (
                                    <motion.div
                                        key={badge.id}
                                        whileHover={{ scale: 1.05 }}
                                        className="p-8 bg-white/5 border border-white/5 rounded-[2.5rem] flex flex-col items-center text-center group transition-all hover:bg-primary/5 hover:border-primary/20"
                                    >
                                        <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 group-hover:rotate-12 transition-transform">
                                            <Trophy size={24} className="text-primary" />
                                        </div>
                                        <h5 className="text-[10px] font-black uppercase tracking-widest leading-relaxed">{badge.name}</h5>
                                    </motion.div>
                                ))}
                                {/* Fillers if empty */}
                                {(!profile.badges || profile.badges.length === 0) && [1, 2, 3].map(i => (
                                    <div key={i} className="aspect-square bg-white/5 rounded-[2.5rem] border border-dashed border-white/10 flex items-center justify-center grayscale opacity-20">
                                        <LockIcon size={24} />
                                    </div>
                                ))}
                            </div>
                        </section>

                        <div className="flex items-center justify-center p-8 border-2 border-dashed border-white/5 rounded-[3rem] opacity-40">
                            <span className="text-[10px] font-black uppercase tracking-[0.5em]">Activity Stream Locked</span>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
