"use client";

import { useState, useEffect, useCallback } from "react";
import { Timer, Play, Pause, RotateCcw, Coffee } from "lucide-react";
import { motion } from "framer-motion";

interface PomodoroProps {
    initialTime?: number;
    onSessionComplete?: () => void;
}

export const Pomodoro = ({ initialTime = 25 * 60, onSessionComplete }: PomodoroProps) => {
    const [timeLeft, setTimeLeft] = useState(initialTime);
    const [isActive, setIsActive] = useState(false);
    const [isBreak, setIsBreak] = useState(false);

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
    };

    const toggleTimer = () => setIsActive(!isActive);

    const resetTimer = () => {
        setIsActive(false);
        setTimeLeft(isBreak ? 5 * 60 : 25 * 60);
    };

    useEffect(() => {
        let interval: any;
        if (isActive && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft((prev) => prev - 1);
            }, 1000);
        } else if (timeLeft === 0) {
            if (!isBreak) {
                setIsBreak(true);
                setTimeLeft(5 * 60);
                onSessionComplete?.();
            } else {
                setIsBreak(false);
                setTimeLeft(25 * 60);
            }
            setIsActive(false);
        }
        return () => clearInterval(interval);
    }, [isActive, timeLeft, isBreak, onSessionComplete]);

    return (
        <div className="flex flex-col items-center p-6 bg-card border rounded-[2rem] shadow-xl overflow-hidden relative">
            <div className={`absolute top-0 left-0 h-1 bg-primary transition-all duration-1000`} style={{ width: `${(timeLeft / (isBreak ? 300 : 1500)) * 100}%` }} />

            <div className="flex items-center gap-2 mb-4">
                {isBreak ? (
                    <div className="px-3 py-1 bg-orange-500/10 text-orange-500 rounded-full text-[10px] font-bold uppercase flex items-center gap-1.5 ring-1 ring-orange-500/20">
                        <Coffee size={12} /> Break Time
                    </div>
                ) : (
                    <div className="px-3 py-1 bg-primary/10 text-primary rounded-full text-[10px] font-bold uppercase flex items-center gap-1.5 ring-1 ring-primary/20">
                        <Timer size={12} /> Focus Session
                    </div>
                )}
            </div>

            <motion.div
                key={timeLeft}
                initial={{ y: 5, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="text-6xl font-black font-outfit mb-6 tracking-tighter"
            >
                {formatTime(timeLeft)}
            </motion.div>

            <div className="flex items-center gap-3">
                <button
                    onClick={toggleTimer}
                    className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all shadow-lg ${isActive ? "bg-muted text-foreground ring-1 ring-border" : "bg-primary text-white shadow-primary/30 hover:scale-105"
                        }`}
                >
                    {isActive ? <Pause size={24} /> : <Play size={24} fill="currentColor" />}
                </button>
                <button
                    onClick={resetTimer}
                    className="w-14 h-14 bg-secondary text-secondary-foreground rounded-2xl flex items-center justify-center hover:bg-secondary/80 transition-all border"
                >
                    <RotateCcw size={20} />
                </button>
            </div>
        </div>
    );
};
