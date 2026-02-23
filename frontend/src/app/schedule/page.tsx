"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
    Calendar,
    Clock,
    ArrowRight,
    Plus,
    Home,
    Search,
    ChevronLeft,
    ChevronRight,
    MapPin,
    Users
} from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function SchedulePage() {
    const { user, token } = useAuthStore();
    const router = useRouter();
    const [sessions, setSessions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [monthOffset, setMonthOffset] = useState(0);
    const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
    const [filter, setFilter] = useState<'ALL' | 'MY'>('ALL');
    const [showProposeModal, setShowProposeModal] = useState(false);
    const [creating, setCreating] = useState(false);
    const [newSession, setNewSession] = useState({
        title: "",
        date: new Date().toISOString().split('T')[0],
        startTime: "12:00",
        roomCode: ""
    });

    // Derived sessions filtered by date and ownership
    const filteredSessions = sessions.filter(s => {
        const sessionDate = new Date(s.startTime).toISOString().split('T')[0];
        const matchesDate = sessionDate === selectedDate;
        const matchesOwnership = filter === 'ALL' || s.creatorId === user?.id;
        return matchesDate && matchesOwnership;
    });

    const handlePropose = async () => {
        if (!newSession.title) {
            alert("Please provide a title for your session.");
            return;
        }

        setCreating(true);
        try {
            const startTime = new Date(`${newSession.date}T${newSession.startTime}`);
            const endTime = new Date(startTime.getTime() + 60 * 60 * 1000); // Default 1hr

            const res = await fetch("http://localhost:5000/api/sessions", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    title: newSession.title,
                    startTime,
                    endTime
                })
            });

            if (res.ok) {
                const sessionData = await res.json();
                setShowProposeModal(false);
                setNewSession({
                    title: "",
                    date: new Date().toISOString().split('T')[0],
                    startTime: "12:00",
                    roomCode: ""
                });

                // Navigate to the newly created room automatically
                router.push(`/room/${sessionData.room.code}`);
            } else {
                const err = await res.json();
                alert(err.message || "Failed to schedule session.");
            }
        } catch (err) {
            console.error(err);
            alert("Network error occurred.");
        } finally {
            setCreating(false);
        }
    };

    useEffect(() => {
        if (!token) {
            router.push("/login");
            return;
        }

        const fetchSessions = async () => {
            try {
                const res = await fetch("http://localhost:5000/api/sessions/global", {
                    headers: { "Authorization": `Bearer ${token}` }
                });
                const data = await res.json();
                if (res.ok) {
                    setSessions(data);
                }
            } catch (err) {
                console.error("Failed to fetch global sessions", err);
            } finally {
                setLoading(false);
            }
        };

        fetchSessions();
    }, [token, router]);

    if (!user) return null;

    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col">
            {/* Header */}
            <header className="h-24 border-b border-white/5 bg-background/50 backdrop-blur-xl sticky top-0 z-50 px-8 flex items-center justify-between">
                <div className="flex items-center gap-8">
                    <Link href="/dashboard" className="flex items-center gap-2 text-muted-foreground hover:text-white transition-colors">
                        <Home size={20} />
                        <span className="text-xs font-black uppercase tracking-widest">Dashboard</span>
                    </Link>
                    <div className="h-6 w-px bg-white/10" />
                    <h1 className="text-2xl font-black font-outfit uppercase tracking-tighter">Global Schedule</h1>
                </div>

                <div className="flex items-center gap-4">
                    <button
                        onClick={() => setShowProposeModal(true)}
                        className="flex items-center gap-3 px-6 py-3 bg-primary text-primary-foreground rounded-2xl font-black uppercase text-[10px] tracking-widest hover:shadow-lg transition-all"
                    >
                        <Plus size={16} strokeWidth={3} />
                        Propose Session
                    </button>
                </div>
            </header>

            {/* Propose Modal */}
            {showProposeModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        onClick={() => setShowProposeModal(false)}
                        className="absolute inset-0 bg-background/80 backdrop-blur-md"
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        className="relative w-full max-w-xl bg-card border border-white/10 rounded-[2.5rem] p-10 shadow-2xl"
                    >
                        <div className="mb-8">
                            <h2 className="text-2xl font-black font-outfit uppercase tracking-tight mb-2">Propose New Block</h2>
                            <p className="text-sm text-muted-foreground">Schedule a study session and broadcast it to the network.</p>
                        </div>

                        <div className="space-y-6">
                            <div>
                                <label className="block text-[10px] font-black uppercase tracking-widest text-primary mb-3 pl-1">Session Title</label>
                                <input
                                    type="text"
                                    placeholder="e.g., Quantum Physics deep dive"
                                    className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl focus:border-primary outline-none transition-all font-medium"
                                    value={newSession.title}
                                    onChange={(e) => setNewSession({ ...newSession, title: e.target.value })}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-[10px] font-black uppercase tracking-widest text-primary mb-3 pl-1">Date</label>
                                    <input
                                        type="date"
                                        className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl focus:border-primary outline-none transition-all font-medium"
                                        value={newSession.date}
                                        onChange={(e) => setNewSession({ ...newSession, date: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black uppercase tracking-widest text-primary mb-3 pl-1">Start Time</label>
                                    <input
                                        type="time"
                                        className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl focus:border-primary outline-none transition-all font-medium"
                                        value={newSession.startTime}
                                        onChange={(e) => setNewSession({ ...newSession, startTime: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="flex gap-4 pt-4">
                                <button
                                    onClick={() => setShowProposeModal(false)}
                                    className="flex-1 py-4 bg-white/5 rounded-2xl font-bold uppercase text-[10px] tracking-widest hover:bg-white/10 transition-all text-muted-foreground"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handlePropose}
                                    disabled={creating}
                                    className="flex-1 py-4 bg-primary text-primary-foreground rounded-2xl font-black uppercase text-[10px] tracking-widest hover:shadow-xl hover:shadow-primary/20 transition-all disabled:opacity-50"
                                >
                                    {creating ? "BROADCASTING..." : "Broadcast Session"}
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}

            <main className="flex-1 p-12 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-4 gap-12">
                {/* Mini Calendar View */}
                <aside className="lg:col-span-1 space-y-8">
                    <div className="bg-card border border-white/5 rounded-[2.5rem] p-8 shadow-premium">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="font-bold uppercase tracking-widest text-[10px]">
                                {new Date(new Date().setMonth(new Date().getMonth() + monthOffset)).toLocaleString('default', { month: 'long', year: 'numeric' })}
                            </h3>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setMonthOffset(prev => prev - 1)}
                                    className="p-1.5 hover:bg-white/5 rounded-lg text-muted-foreground hover:text-white transition-colors"
                                >
                                    <ChevronLeft size={16} />
                                </button>
                                <button
                                    onClick={() => setMonthOffset(prev => prev + 1)}
                                    className="p-1.5 hover:bg-white/5 rounded-lg text-muted-foreground hover:text-white transition-colors"
                                >
                                    <ChevronRight size={16} />
                                </button>
                            </div>
                        </div>
                        <div className="grid grid-cols-7 gap-1 text-center mb-4">
                            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
                                <span key={`${day}-${i}`} className="text-[10px] font-black opacity-20">{day}</span>
                            ))}
                        </div>
                        <div className="grid grid-cols-7 gap-1">
                            {/* Empty pads for start of month */}
                            {Array.from({ length: new Date(new Date().getFullYear(), new Date().getMonth() + monthOffset, 1).getDay() }).map((_, i) => (
                                <div key={`pad-${i}`} className="aspect-square" />
                            ))}
                            {Array.from({ length: new Date(new Date().getFullYear(), new Date().getMonth() + monthOffset + 1, 0).getDate() }).map((_, i) => {
                                const day = i + 1;
                                const dateObj = new Date(new Date().getFullYear(), new Date().getMonth() + monthOffset, day);
                                const dateStr = dateObj.toISOString().split('T')[0];
                                const isSelected = dateStr === selectedDate;
                                const isToday = dateStr === new Date().toISOString().split('T')[0];

                                return (
                                    <button
                                        key={day}
                                        onClick={() => setSelectedDate(dateStr)}
                                        className={`aspect-square flex flex-col items-center justify-center text-[10px] font-black rounded-xl transition-all relative group ${isSelected
                                            ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20 scale-110 z-10'
                                            : isToday
                                                ? 'bg-white/10 text-white'
                                                : 'hover:bg-white/5 text-muted-foreground hover:text-white'
                                            }`}
                                    >
                                        {day}
                                        {sessions.some(s => {
                                            const sDate = new Date(s.startTime);
                                            return sDate.getFullYear() === dateObj.getFullYear() &&
                                                sDate.getMonth() === dateObj.getMonth() &&
                                                sDate.getDate() === dateObj.getDate();
                                        }) && (
                                                <div className={`w-1 h-1 rounded-full absolute bottom-1.5 ${isSelected ? 'bg-white' : 'bg-primary'}`} />
                                            )}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    <div className="p-8 bg-primary/10 rounded-[2rem] border border-primary/20">
                        <h4 className="text-primary font-black uppercase text-[10px] tracking-widest mb-4">Next Up</h4>
                        {sessions.length > 0 ? (
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center text-white font-black">
                                    {new Date(sessions[0].startTime).getDate()}
                                </div>
                                <div>
                                    <div className="text-sm font-bold truncate max-w-[120px]">{sessions[0].title}</div>
                                    <div className="text-[10px] uppercase font-bold opacity-40 italic">Coming Soon</div>
                                </div>
                            </div>
                        ) : (
                            <p className="text-[10px] font-bold opacity-40 uppercase">No sessions coming up</p>
                        )}
                    </div>
                </aside>

                {/* Main Schedule Feed */}
                <div className="lg:col-span-3 space-y-12">
                    <div className="flex items-center justify-between">
                        <div className="space-y-1">
                            <h2 className="text-2xl font-black uppercase tracking-widest flex items-center gap-3">
                                <Clock className="text-primary" size={24} />
                                Timeline for {new Date(selectedDate).toLocaleDateString('default', { day: 'numeric', month: 'long' })}
                            </h2>
                            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest pl-9">Sessions scheduled for this specific date</p>
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setFilter('ALL')}
                                className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase transition-all ${filter === 'ALL' ? 'bg-white/10 text-white border border-white/10' : 'text-muted-foreground hover:text-white'}`}
                            >
                                All
                            </button>
                            <button
                                onClick={() => setFilter('MY')}
                                className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase transition-all ${filter === 'MY' ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20' : 'text-muted-foreground hover:text-white'}`}
                            >
                                My Sessions
                            </button>
                        </div>
                    </div>

                    <div className="space-y-6">
                        {filteredSessions.length === 0 ? (
                            <div className="text-center py-12 opacity-40 border-2 border-dashed border-white/5 rounded-[3rem] bg-white/[0.01]">
                                <Calendar size={32} className="mx-auto mb-3 opacity-20" />
                                <p className="font-bold uppercase tracking-widest text-[10px]">No sessions on this date</p>
                            </div>
                        ) : (
                            filteredSessions.map((session, i) => (
                                <SessionCard key={session.id} session={session} index={i} router={router} />
                            ))
                        )}
                    </div>

                    {/* Global Upcoming Feed - Always visible */}
                    <div className="pt-8 border-t border-white/5">
                        <div className="mb-8">
                            <h2 className="text-xl font-black uppercase tracking-widest flex items-center gap-3">
                                <Search className="text-primary" size={20} />
                                Worldwide Network
                            </h2>
                            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest pl-8">All upcoming broadcasts across the study hub</p>
                        </div>

                        <div className="grid grid-cols-1 gap-6">
                            {sessions.filter(s => new Date(s.startTime) > new Date()).length === 0 ? (
                                <div className="p-8 bg-white/5 rounded-[2rem] text-center italic text-muted-foreground text-xs">
                                    No global broadcasts scheduled. Be the first to propose one!
                                </div>
                            ) : (
                                sessions
                                    .filter(s => new Date(s.startTime) > new Date())
                                    .slice(0, 5)
                                    .map((session, i) => (
                                        <SessionCard key={session.id} session={session} index={i} router={router} compact />
                                    ))
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

// Sub-component for session display to avoid repetition
function SessionCard({ session, index, router, compact }: { session: any, index: number, router: any, compact?: boolean }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            onClick={() => router.push(`/room/${session.room.code}`)}
            className={`${compact ? 'p-6' : 'p-8'} bg-card border border-white/5 rounded-[2.5rem] flex items-center gap-8 group hover:bg-white/[0.02] transition-all cursor-pointer shadow-premium relative overflow-hidden`}
        >
            <div className={`flex flex-col items-center justify-center ${compact ? 'min-w-[70px] h-16' : 'min-w-[80px] h-20'} bg-white/5 rounded-3xl border border-white/5`}>
                <span className="text-[10px] font-black uppercase opacity-40">
                    {new Date(session.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }).split(' ')[1]}
                </span>
                <span className={`${compact ? 'text-xl' : 'text-2xl'} font-black text-primary`}>
                    {new Date(session.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }).split(':')[0]}
                </span>
            </div>

            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-2">
                    <h3 className={`${compact ? 'text-lg' : 'text-xl'} font-bold truncate uppercase tracking-tight`}>{session.title}</h3>
                    <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-[8px] font-black uppercase tracking-widest border border-primary/20">{session.room.category}</span>
                    {compact && <span className="text-[8px] font-black opacity-30 uppercase">{new Date(session.startTime).toLocaleDateString()}</span>}
                </div>
                {!compact && (
                    <div className="flex items-center gap-4 text-muted-foreground">
                        <div className="flex items-center gap-1.5">
                            <MapPin size={14} className="text-primary" />
                            <span className="text-xs font-bold uppercase">{session.room.name}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <Users size={14} className="text-primary" />
                            <span className="text-xs font-bold uppercase">Open Access</span>
                        </div>
                    </div>
                )}
            </div>

            <div className="flex gap-2">
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        const url = `${window.location.origin}/room/${session.room.code}`;
                        navigator.clipboard.writeText(url);
                        alert("Invite link copied to clipboard!");
                    }}
                    className={`${compact ? 'px-4 py-2' : 'px-6 py-3'} bg-white/5 rounded-2xl text-[9px] font-black uppercase tracking-widest hover:bg-white/10 transition-all text-primary border border-primary/20`}
                >
                    Invite
                </button>
                <button className={`${compact ? 'px-4 py-2' : 'px-6 py-3'} bg-primary text-white rounded-2xl text-[9px] font-black uppercase tracking-widest hover:shadow-lg hover:shadow-primary/20 transition-all`}>Attend</button>
            </div>
        </motion.div>
    );
}

