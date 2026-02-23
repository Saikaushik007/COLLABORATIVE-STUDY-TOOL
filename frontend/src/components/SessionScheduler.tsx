"use client";

import { useState, useEffect } from "react";
import { Calendar as CalendarIcon, Clock, Plus, Trash2, Bell } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuthStore } from "@/store/useAuthStore";

interface Session {
    id: string;
    title: string;
    description: string;
    startTime: string;
    endTime: string;
    creatorId: string;
}

export const SessionScheduler = ({ roomId }: { roomId: string }) => {
    const { token, user } = useAuthStore();
    const [sessions, setSessions] = useState<Session[]>([]);
    const [showAdd, setShowAdd] = useState(false);
    const [newSession, setNewSession] = useState({
        title: "",
        description: "",
        startTime: "",
        endTime: "",
    });

    useEffect(() => {
        fetchSessions();
    }, [roomId]);

    const fetchSessions = async () => {
        try {
            const res = await fetch(`http://localhost:5000/api/sessions/room/${roomId}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            setSessions(data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await fetch("http://localhost:5000/api/sessions", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ ...newSession, roomId }),
            });
            if (res.ok) {
                setShowAdd(false);
                fetchSessions();
                setNewSession({ title: "", description: "", startTime: "", endTime: "" });
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleDelete = async (id: string) => {
        try {
            await fetch(`http://localhost:5000/api/sessions/${id}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            fetchSessions();
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="p-6 bg-card/10 h-full flex flex-col">
            <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold flex items-center gap-2 text-primary font-outfit uppercase tracking-wider text-sm">
                    <CalendarIcon size={18} />
                    Scheduled Sessions
                </h3>
                <button
                    onClick={() => setShowAdd(!showAdd)}
                    className="p-2 bg-primary text-white rounded-xl hover:scale-105 transition-transform shadow-lg shadow-primary/20"
                >
                    <Plus size={16} />
                </button>
            </div>

            <AnimatePresence>
                {showAdd && (
                    <motion.form
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        onSubmit={handleAdd}
                        className="mb-6 p-4 bg-muted/50 border rounded-2xl space-y-3 overflow-hidden"
                    >
                        <input
                            type="text"
                            placeholder="Session Title"
                            value={newSession.title}
                            onChange={(e) => setNewSession({ ...newSession, title: e.target.value })}
                            className="w-full bg-background border px-4 py-2 rounded-xl text-sm outline-none focus:ring-1 focus:ring-primary"
                            required
                        />
                        <div className="flex gap-2">
                            <input
                                type="datetime-local"
                                value={newSession.startTime}
                                onChange={(e) => setNewSession({ ...newSession, startTime: e.target.value })}
                                className="flex-1 bg-background border px-4 py-2 rounded-xl text-xs outline-none focus:ring-1 focus:ring-primary"
                                required
                            />
                            <input
                                type="datetime-local"
                                value={newSession.endTime}
                                onChange={(e) => setNewSession({ ...newSession, endTime: e.target.value })}
                                className="flex-1 bg-background border px-4 py-2 rounded-xl text-xs outline-none focus:ring-1 focus:ring-primary"
                                required
                            />
                        </div>
                        <button className="w-full py-2 bg-primary text-white rounded-xl font-bold text-sm">
                            Schedule Now
                        </button>
                    </motion.form>
                )}
            </AnimatePresence>

            <div className="flex-1 overflow-y-auto space-y-3 pr-2">
                {sessions.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center opacity-30 mt-10">
                        <Bell size={40} className="mb-2" />
                        <p className="text-xs">No sessions planned yet.</p>
                    </div>
                ) : (
                    sessions.map((session) => (
                        <motion.div
                            key={session.id}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="p-4 bg-card border border-primary/10 rounded-2xl hover:border-primary/30 transition-all group"
                        >
                            <div className="flex justify-between items-start">
                                <div>
                                    <h4 className="font-bold text-sm">{session.title}</h4>
                                    <div className="flex items-center gap-2 mt-1.5 text-[10px] text-muted-foreground font-medium">
                                        <Clock size={12} className="text-primary" />
                                        {new Date(session.startTime).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                                    </div>
                                </div>
                                {session.creatorId === user?.id && (
                                    <button
                                        onClick={() => handleDelete(session.id)}
                                        className="p-1.5 text-muted-foreground hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                )}
                            </div>
                        </motion.div>
                    ))
                )}
            </div>
        </div>
    );
};
