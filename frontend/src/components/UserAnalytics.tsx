"use client";

import { motion } from "framer-motion";
import { TrendingUp, Clock, Zap, Target } from "lucide-react";

export const UserAnalytics = ({ stats }: { stats: any }) => {
    const data = (stats.historical || []).length > 0 ? stats.historical : [
        { label: "M", id: "Mon", value: 0 },
        { label: "T", id: "Tue", value: 0 },
        { label: "W", id: "Wed", value: 0 },
        { label: "T", id: "Thu", value: 0 },
        { label: "F", id: "Fri", value: 0 },
        { label: "S", id: "Sat", value: 0 },
        { label: "S", id: "Sun", value: 0 },
    ];

    const max = Math.max(...data.map((d: any) => d.value), 5); // Default scale of 5h

    return (
        <div className="bg-card/50 backdrop-blur-xl border border-white/5 rounded-[2.5rem] p-8 shadow-premium">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h2 className="text-lg font-black font-outfit uppercase tracking-widest flex items-center gap-3">
                        <TrendingUp className="text-primary" />
                        Focus Intensity
                    </h2>
                    <p className="text-[10px] text-muted-foreground font-bold uppercase opacity-60 mt-1">Activity over the last 7 sessions</p>
                </div>
            </div>

            <div className="grid grid-cols-7 gap-3 items-end h-32 mb-8 px-2">
                {data.map((day: any, i: number) => (
                    <div key={day.id || i} className="flex flex-col items-center gap-2 group h-full justify-end">
                        <motion.div
                            initial={{ height: 0 }}
                            animate={{ height: `${(day.value / max) * 100}%` }}
                            transition={{ delay: i * 0.05, duration: 0.8 }}
                            className={`w-full ${day.value > 0 ? 'bg-primary' : 'bg-white/5'} hover:scale-110 rounded-t-lg transition-all relative min-h-[4px]`}
                        >
                            {day.value > 0 && (
                                <div className="absolute -top-10 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-primary text-white text-[10px] font-black px-2 py-1 rounded-lg shadow-xl z-10">
                                    {day.value}h
                                </div>
                            )}
                        </motion.div>
                        <span className="text-[8px] font-black text-muted-foreground uppercase opacity-40">{day.label}</span>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-white/5 rounded-2xl border border-white/5 group hover:border-primary/50 transition-colors">
                    <div className="flex items-center gap-2 text-primary mb-1">
                        <Clock size={12} strokeWidth={3} />
                        <span className="text-[9px] font-black uppercase tracking-wider">Total Focus</span>
                    </div>
                    <div className="text-xl font-black font-outfit">{stats.studyHours || 0}h</div>
                </div>
                <div className="p-4 bg-white/5 rounded-2xl border border-white/5 group hover:border-orange-500/50 transition-colors">
                    <div className="flex items-center gap-2 text-orange-500 mb-1">
                        <Target size={12} strokeWidth={3} />
                        <span className="text-[9px] font-black uppercase tracking-wider">Focus Streak</span>
                    </div>
                    <div className="text-xl font-black font-outfit">{stats.focusStreak || 0}d</div>
                </div>
            </div>
        </div>
    );
};
