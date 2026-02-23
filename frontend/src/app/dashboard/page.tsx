"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
    Users,
    Plus,
    Search,
    TrendingUp,
    Clock,
    Zap,
    ArrowRight,
    ShieldCheck,
    Calendar,
    Bell,
    Settings,
    LogOut,
    Mail,
    Phone,
    MapPin
} from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Leaderboard } from "@/components/Leaderboard";
import { UserAnalytics } from "@/components/UserAnalytics";

export default function Dashboard() {
    const { user, token, logout } = useAuthStore();
    const [rooms, setRooms] = useState([]);
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        if (!token) {
            router.push("/login");
            return;
        }

        const fetchData = async () => {
            try {
                // Fetch rooms
                const roomsRes = await fetch("http://localhost:5000/api/rooms");
                if (roomsRes.status === 401) {
                    logout();
                    return;
                }
                const roomsData = await roomsRes.json();
                setRooms(roomsData);

                // Fetch real-time health/stats
                const statsRes = await fetch("http://localhost:5000/api/gamification/stats", {
                    headers: { "Authorization": `Bearer ${token}` }
                });

                if (statsRes.status === 401) {
                    logout();
                    return;
                }

                const statsData = await statsRes.json();
                setStats(statsData);
            } catch (err) {
                console.error("Dashboard data fetch failed", err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [token, router]);

    if (!user) return null;

    return (
        <div className="min-h-screen bg-background text-foreground flex overflow-hidden">
            {/* Left Profile Sidebar */}
            <aside className="hidden xl:flex w-80 h-screen border-r border-white/5 bg-card flex-col p-8 overflow-y-auto">
                <Link href={`/profile/${user.id}`} className="mb-10 flex flex-col items-center text-center group cursor-pointer">
                    <div className="relative mb-6">
                        <div className="w-24 h-24 bg-gradient-to-br from-primary to-purple-600 rounded-3xl rotate-3 shadow-xl flex items-center justify-center p-1 group-hover:rotate-0 transition-transform">
                            <div className="w-full h-full bg-card rounded-[1.2rem] flex items-center justify-center overflow-hidden">
                                {user.image ? (
                                    <img src={user.image} alt={user.name} className="w-full h-full object-cover" />
                                ) : (
                                    <span className="text-3xl font-black text-primary">{user.name ? user.name[0].toUpperCase() : "S"}</span>
                                )}
                            </div>
                        </div>
                        <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-emerald-400 border-4 border-card rounded-full" />
                    </div>
                    <h2 className="text-xl font-bold font-outfit uppercase tracking-wider">{user.name}</h2>
                    <p className="text-[10px] text-muted-foreground font-bold tracking-[0.2em] mt-1 uppercase">View Public Profile</p>
                </Link>

                <div className="space-y-8 flex-1">
                    <div className="space-y-4">
                        <div className="text-[10px] text-muted-foreground uppercase font-black tracking-widest pl-4">Personal Details</div>
                        <div className="space-y-3">
                            {[
                                { icon: Mail, label: user.email },
                                { icon: Phone, label: "+1234567890" },
                                { icon: MapPin, label: "Global Hub, Space" }
                            ].map((item, i) => (
                                <div key={i} className="flex items-center gap-3 p-3 bg-white/5 rounded-2xl border border-transparent hover:border-white/10 transition-colors">
                                    <item.icon size={16} className="text-primary" />
                                    <span className="text-xs font-semibold truncate">{item.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="text-[10px] text-muted-foreground uppercase font-black tracking-widest pl-4">Your Achievements</div>
                        <div className="grid grid-cols-2 gap-3">
                            {stats?.achievements?.length > 0 ? (
                                stats.achievements.slice(0, 4).map((ach: any, i: number) => (
                                    <div key={i} className="aspect-square bg-white/5 rounded-2xl border border-white/10 flex flex-col items-center justify-center gap-2 group cursor-help hover:bg-white/10 transition-all">
                                        <Zap size={20} className="text-amber-400 group-hover:scale-110 transition-transform" />
                                        <span className="text-[8px] font-black uppercase tracking-tighter opacity-40 group-hover:opacity-100 transition-opacity">{ach.title}</span>
                                    </div>
                                ))
                            ) : (
                                [1, 2, 3, 4].map((_, i) => (
                                    <div key={i} className="aspect-square bg-white/5 rounded-2xl border border-dashed border-white/10 flex flex-col items-center justify-center gap-2 opacity-30 grayscale saturate-0">
                                        <ShieldCheck size={20} />
                                        <span className="text-[8px] font-black uppercase tracking-tighter">Locked</span>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>

                <button
                    onClick={() => logout()}
                    className="mt-10 flex items-center gap-3 p-4 bg-rose-500/10 text-rose-500 rounded-2xl border border-rose-500/20 hover:bg-rose-500 hover:text-white transition-all font-bold uppercase text-[10px] tracking-widest"
                >
                    <LogOut size={16} />
                    Logout Account
                </button>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 overflow-y-auto">
                <header className="h-20 border-b border-white/5 bg-background/50 backdrop-blur-xl sticky top-0 z-20 px-4 md:px-12 flex items-center justify-between">
                    <div className="flex items-center gap-6">
                        <Link href="/dashboard" className="text-xs font-black uppercase tracking-widest text-primary border-b-2 border-primary pb-1">Dashboard</Link>
                        <Link href="/discovery" className="text-xs font-black uppercase tracking-widest text-muted-foreground hover:text-white transition-colors pb-1 border-b-2 border-transparent">Discovery</Link>
                        <Link href="/schedule" className="text-xs font-black uppercase tracking-widest text-muted-foreground hover:text-white transition-colors pb-1 border-b-2 border-transparent">Schedule</Link>
                    </div>

                    <div className="flex items-center gap-6">
                        <button
                            onClick={() => alert("Notifications coming soon!")}
                            className="relative p-2 text-muted-foreground hover:text-white transition-colors"
                        >
                            <Bell size={20} />
                            <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full ring-4 ring-background" />
                        </button>
                        <button
                            onClick={() => alert("Settings coming soon!")}
                            className="p-2 text-muted-foreground hover:text-white transition-colors"
                        >
                            <Settings size={20} />
                        </button>
                        <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center cursor-help" title="Elite Scholar Status">
                            <Zap size={20} className="text-primary fill-current" />
                        </div>
                    </div>
                </header>

                <div className="p-4 md:p-12 max-w-7xl mx-auto space-y-12">
                    {/* Welcome & Action */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                        <div>
                            <h1 className="text-4xl font-black font-outfit uppercase tracking-tight">Active Room Hub</h1>
                            <p className="text-muted-foreground font-medium">Build your circle, boost your focus.</p>
                        </div>
                        <Link
                            href="/create-room"
                            className="flex items-center justify-center gap-3 px-8 py-4 bg-primary text-primary-foreground rounded-2xl font-black uppercase tracking-widest hover:shadow-[0_20px_40px_-15px_rgba(var(--color-primary),0.5)] transition-all transform hover:-translate-y-1"
                        >
                            <Plus size={20} strokeWidth={3} />
                            Launch New Lab
                        </Link>
                    </div>

                    {/* Quick Stats / Daily Focus (Management Look) */}
                    <section>
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-xl font-black uppercase tracking-widest flex items-center gap-3">
                                <TrendingUp className="text-primary" />
                                Productivity Analytics
                            </h2>
                            <div className="text-[10px] font-black text-muted-foreground uppercase tracking-widest px-4 py-1.5 bg-white/5 rounded-full border border-white/5">Real-time Stats</div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {[
                                { label: "Total Focus", value: `${stats?.stats?.studyHours || 0}h`, icon: Clock, color: "text-primary", bg: "bg-primary/10", progress: Math.min(100, (stats?.stats?.studyHours || 0) * 10) },
                                { label: "Session Avg", value: "1.2h", icon: Zap, color: "text-amber-400", bg: "bg-amber-400/10", progress: 65 },
                                { label: "Focus Rank", value: `Lvl ${stats?.level || 1}`, icon: ShieldCheck, color: "text-emerald-400", bg: "bg-emerald-400/10", progress: Math.max(20, Math.min(100, (stats?.points % 100) + 15)) },
                                { label: "Community", value: "Top 5%", icon: Users, color: "text-purple-400", bg: "bg-purple-400/10", progress: 82 }
                            ].map((stat, i) => (
                                <motion.div
                                    key={i}
                                    whileHover={{ scale: 1.02 }}
                                    className="p-8 bg-card border border-white/5 rounded-[2.5rem] flex flex-col items-center text-center group transition-all hover:border-primary/50"
                                >
                                    <div className={`w-16 h-16 ${stat.bg} rounded-3xl flex items-center justify-center mb-6 group-hover:rotate-6 transition-transform`}>
                                        <stat.icon className={`${stat.color} w-8 h-8`} />
                                    </div>
                                    <div className="text-3xl font-black mb-2">{stat.value}</div>
                                    <div className="text-[10px] text-muted-foreground font-black uppercase tracking-widest mb-6">{stat.label}</div>

                                    {/* Circular Progress (Minimalist) */}
                                    <div className="relative w-24 h-24 flex items-center justify-center">
                                        <svg className="w-full h-full -rotate-90">
                                            <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="6" fill="transparent" className="text-white/5" />
                                            <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="6" fill="transparent" strokeDasharray={251} strokeDashoffset={251 - (251 * stat.progress) / 100} className={`${stat.color} transition-all duration-1000`} />
                                        </svg>
                                        <span className="absolute text-xs font-black">{Math.round(stat.progress)}%</span>
                                    </div>
                                    <div className="mt-4 text-[9px] font-bold text-muted-foreground uppercase tracking-[0.2em]">Efficiency</div>
                                </motion.div>
                            ))}
                        </div>
                    </section>

                    {/* Two Column Section */}
                    <div className="grid lg:grid-cols-3 gap-12">
                        {/* Feed / Rooms */}
                        <div className="lg:col-span-2 space-y-8">
                            <div className="flex items-center justify-between">
                                <h2 className="text-xl font-black uppercase tracking-widest">Global Discovery</h2>
                                <div className="flex gap-2">
                                    <button className="p-2 rounded-xl bg-white/5 border border-white/5 text-muted-foreground hover:text-white transition-all"><Search size={18} /></button>
                                </div>
                            </div>

                            {loading ? (
                                <div className="space-y-4">
                                    {[1, 2, 3].map(i => <div key={i} className="h-40 bg-white/5 animate-pulse rounded-[2.5rem]" />)}
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    {rooms.slice(0, 4).map((room: any) => (
                                        <motion.div
                                            key={room.id}
                                            whileHover={{ x: 10 }}
                                            className="p-8 bg-card border border-white/5 rounded-[2.5rem] flex items-center gap-8 group transition-all hover:bg-white/[0.02]"
                                        >
                                            <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center text-primary font-black text-2xl group-hover:bg-primary group-hover:text-white transition-all">
                                                {room.name[0].toUpperCase()}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <h3 className="text-xl font-bold truncate uppercase tracking-tight">{room.name}</h3>
                                                    <span className="px-3 py-1 bg-emerald-400/10 text-emerald-400 rounded-full text-[9px] font-black uppercase tracking-widest border border-emerald-400/20">LIVE</span>
                                                </div>
                                                <p className="text-muted-foreground text-sm line-clamp-1">{room.description || "Experimental study session focused on deep work."}</p>
                                            </div>
                                            <div className="hidden sm:flex flex-col items-center gap-1 min-w-[80px]">
                                                <div className="text-lg font-black">{room._count?.members || 0}</div>
                                                <div className="text-[9px] font-bold text-muted-foreground uppercase">Members</div>
                                            </div>
                                            <Link
                                                href={`/room/${room.code}`}
                                                className="p-4 bg-white/5 rounded-2xl hover:bg-primary hover:text-white transition-all"
                                            >
                                                <ArrowRight size={24} />
                                            </Link>
                                        </motion.div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Sidebar Components */}
                        <div className="space-y-12">
                            <section className="p-1 rounded-[2.5rem] bg-gradient-to-br from-primary/20 to-purple-600/20 shadow-premium">
                                <div className="p-8 bg-background rounded-[2.3rem] border border-white/5">
                                    <h3 className="text-lg font-black uppercase tracking-widest mb-6">Hall of Fame</h3>
                                    <Leaderboard />
                                </div>
                            </section>

                            <section className="bg-card border border-white/5 rounded-[2.5rem] p-8">
                                <h3 className="text-lg font-black uppercase tracking-widest mb-6">Weekly Analytics</h3>
                                <UserAnalytics stats={stats?.stats || {}} />
                            </section>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
