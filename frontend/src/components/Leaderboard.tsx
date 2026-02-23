"use client";

import { useEffect, useState } from "react";
import { Trophy, Medal, Target, Flame, Zap, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";

export const Leaderboard = () => {
    const [users, setUsers] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchLeaderboard = async () => {
            try {
                const res = await fetch("http://localhost:5000/api/gamification/leaderboard");
                const data = await res.json();
                setUsers(data);
            } catch (err) {
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchLeaderboard();
    }, []);

    if (isLoading) return <div className="h-64 flex items-center justify-center animate-pulse text-muted-foreground">Loading ranks...</div>;

    return (
        <div className="bg-card/50 backdrop-blur-xl border border-primary/20 rounded-[2.5rem] p-8 shadow-2xl">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h2 className="text-2xl font-black font-outfit text-primary flex items-center gap-3">
                        <Trophy className="text-yellow-500" />
                        Hall of Fame
                    </h2>
                    <p className="text-sm text-muted-foreground font-medium">Top contributors this week</p>
                </div>
                <div className="bg-primary/10 px-4 py-2 rounded-2xl border border-primary/20 text-xs font-bold uppercase tracking-widest text-primary">
                    Live Updates
                </div>
            </div>

            <div className="space-y-4">
                {users.length > 0 ? (
                    users.map((user, index) => (
                        <motion.div
                            key={user.id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.1 }}
                            className={`flex items-center justify-between p-4 rounded-3xl border transition-all ${index === 0
                                ? 'bg-yellow-500/10 border-yellow-500/30'
                                : 'bg-muted/30 border-primary/5 hover:border-primary/20'
                                }`}
                        >
                            <div className="flex items-center gap-4">
                                <div className="flex items-center justify-center w-8">
                                    {index === 0 ? <Medal className="text-yellow-500" size={24} /> : <span className="text-lg font-black opacity-20">{index + 1}</span>}
                                </div>
                                <div className="w-12 h-12 bg-primary/20 rounded-2xl flex items-center justify-center font-bold text-primary overflow-hidden border-2 border-primary/20">
                                    {user.image ? <img src={user.image} alt="" className="w-full h-full object-cover" /> : user.name[0]}
                                </div>
                                <div>
                                    <h3 className="font-bold text-sm font-outfit">{user.name}</h3>
                                    <div className="flex items-center gap-3 mt-1">
                                        <div className="flex items-center gap-1 text-[10px] font-bold text-muted-foreground uppercase">
                                            <Zap size={12} className="text-primary" />
                                            {user.points || 0} XP
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))
                ) : (
                    <div className="p-10 text-center border-2 border-dashed border-white/5 rounded-[2rem] opacity-30">
                        <Flame size={40} className="mx-auto mb-4" />
                        <h4 className="text-xs font-black uppercase tracking-widest mb-2">The Board is Open</h4>
                        <p className="text-[10px] font-bold">Start studying to become the first topper of the week!</p>
                    </div>
                )}
            </div>
        </div>
    );
};

const Sparkles = ({ size, className }: { size: number, className: string }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
    >
        <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
        <path d="M5 3v4" /><path d="M19 17v4" /><path d="M3 5h4" /><path d="M17 19h4" />
    </svg>
);
