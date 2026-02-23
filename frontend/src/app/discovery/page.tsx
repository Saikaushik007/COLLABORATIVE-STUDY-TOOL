"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
    Search,
    Filter,
    Users,
    ArrowRight,
    Globe,
    Zap,
    Lock as LockIcon,
    ExternalLink,
    Plus,
    Home
} from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function DiscoveryPage() {
    const { user, token } = useAuthStore();
    const [rooms, setRooms] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [activeCategory, setActiveCategory] = useState("All Hubs");
    const router = useRouter();

    const categories = ["All Hubs", "Deep Work", "Computer Science", "Engineering", "Mathematics", "AI Research", "Social", "Other"];

    useEffect(() => {
        if (!token) {
            router.push("/login");
            return;
        }

        const fetchRooms = async () => {
            try {
                const res = await fetch("http://localhost:5000/api/rooms");
                if (!res.ok) throw new Error("Could not connect to the StudyHub network.");
                const data = await res.json();
                setRooms(data);
            } catch (err) {
                console.error("Failed to fetch rooms", err);
                setError("Network failure: Ensure the backend server is running.");
            } finally {
                setLoading(false);
            }
        };

        fetchRooms();
    }, [token, router]);

    const filteredRooms = rooms.filter((room: any) => {
        const matchesSearch = room.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (room.description || "").toLowerCase().includes(searchQuery.toLowerCase());

        // If searching, show all matches regardless of category. 
        // Otherwise, filter by strictly active category.
        const matchesCategory = searchQuery !== "" || activeCategory === "All Hubs" || room.category === activeCategory;

        return matchesSearch && matchesCategory;
    });

    if (!user) return null;

    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col">
            {/* Header */}
            <header className="h-24 border-b border-white/5 bg-background/50 backdrop-blur-xl sticky top-0 z-50 px-8 flex items-center justify-between">
                <div className="flex items-center gap-8">
                    <Link href="/dashboard" className="flex items-center gap-2 text-muted-foreground hover:text-white transition-colors">
                        <Home size={20} />
                        <span className="text-xs font-black uppercase tracking-widest">Back to Base</span>
                    </Link>
                    <div className="h-6 w-px bg-white/10" />
                    <h1 className="text-2xl font-black font-outfit uppercase tracking-tighter">Global Discovery</h1>
                </div>

                <div className="flex items-center gap-4">
                    <div className="relative group">
                        <input
                            type="text"
                            placeholder="Find your tribe..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="bg-white/5 border border-white/10 rounded-xl px-12 py-3 w-80 text-sm outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all"
                        />
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={18} />
                    </div>
                </div>
            </header>

            <main className="flex-1 p-12 max-w-7xl mx-auto w-full">
                {/* Hero section */}
                <section className="mb-16">
                    <div className="bg-gradient-to-br from-primary/20 via-purple-600/10 to-transparent p-12 rounded-[3rem] border border-white/5 relative overflow-hidden">
                        <div className="relative z-10 max-w-2xl">
                            <div className="flex items-center gap-3 text-primary mb-6">
                                <Globe size={24} className="animate-pulse" />
                                <span className="text-xs font-black uppercase tracking-[0.3em]">Network Live</span>
                            </div>
                            <h2 className="text-5xl font-black font-outfit uppercase tracking-tight mb-4 text-white">Join the Collective Intelligence.</h2>
                            <p className="text-muted-foreground text-lg font-medium leading-relaxed">Browse active study hubs, connect with experts, and multiply your focus capacity. No more studying in isolation.</p>
                        </div>
                        <div className="absolute right-0 top-0 bottom-0 w-1/2 bg-[url('/grid-pattern.svg')] opacity-20 pointer-events-none" />
                    </div>
                </section>

                {/* Filters/Categories */}
                <div className="flex items-center gap-3 mb-12 overflow-x-auto pb-4 no-scrollbar">
                    {categories.map((cat, i) => (
                        <button
                            key={i}
                            onClick={() => setActiveCategory(cat)}
                            className={`px-6 py-3 rounded-2xl whitespace-nowrap text-xs font-black uppercase tracking-widest transition-all ${activeCategory === cat ? 'bg-primary text-primary-foreground' : 'bg-white/5 border border-white/5 text-muted-foreground hover:bg-white/10 hover:text-white'}`}
                        >
                            {cat}
                        </button>
                    ))}
                    <button className="ml-auto flex items-center gap-2 p-3 bg-white/5 border border-white/5 rounded-xl text-muted-foreground hover:text-white">
                        <Filter size={18} />
                        <span className="text-[10px] font-black uppercase">Filter</span>
                    </button>
                </div>

                {/* Main Content Area */}
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[1, 2, 3, 4, 5, 6].map(i => (
                            <div key={i} className="h-64 bg-white/5 rounded-[2.5rem] animate-pulse" />
                        ))}
                    </div>
                ) : error ? (
                    <div className="text-center py-20 bg-red-500/10 border border-red-500/20 rounded-[2.5rem]">
                        <Globe size={48} className="mx-auto mb-4 text-red-500 opacity-50" />
                        <h2 className="text-xl font-black uppercase text-red-500 tracking-widest">{error}</h2>
                        <button onClick={() => window.location.reload()} className="mt-6 px-6 py-2 bg-red-500 text-white rounded-xl font-bold uppercase text-[10px] tracking-widest">Retry Connection</button>
                    </div>
                ) : filteredRooms.length === 0 ? (
                    <div className="text-center py-32 border-2 border-dashed border-white/5 rounded-[4rem] bg-card/10">
                        <Users size={64} className="mx-auto mb-6 text-primary/20" />
                        <h2 className="text-2xl font-black font-outfit uppercase tracking-tight mb-4">No Active Hubs Found</h2>
                        <p className="text-muted-foreground mb-10 max-w-md mx-auto">Be the first to spark a session in this category or adjust your search filters.</p>
                        <Link
                            href="/create-room"
                            className="inline-flex items-center gap-3 px-10 py-5 bg-primary text-primary-foreground rounded-2xl font-black uppercase tracking-widest hover:shadow-[0_20px_40px_-15px_rgba(var(--color-primary),0.5)] transition-all transform hover:-translate-y-1"
                        >
                            <Plus size={20} strokeWidth={3} />
                            Create Your First Hub
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredRooms.map((room, i) => (
                            <motion.div
                                key={room.id}
                                whileHover={{ y: -10 }}
                                className="group bg-card border border-white/5 rounded-[2.5rem] overflow-hidden flex flex-col hover:border-primary/50 transition-all p-1 shadow-premium cursor-pointer"
                                onClick={() => router.push(`/room/${room.code}`)}
                            >
                                <div className="bg-background rounded-[2.3rem] p-8 flex-1 flex flex-col">
                                    <div className="flex items-start justify-between mb-8">
                                        <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary font-black text-2xl group-hover:bg-primary group-hover:text-white transition-all">
                                            {room.name[0].toUpperCase()}
                                        </div>
                                        <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-400/10 text-emerald-400 rounded-full border border-emerald-400/20">
                                            <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                                            <span className="text-[9px] font-black uppercase tracking-tighter">Live</span>
                                        </div>
                                    </div>

                                    <h3 className="text-2xl font-bold font-outfit uppercase tracking-tight mb-2 group-hover:text-primary transition-colors">{room.name}</h3>
                                    <p className="text-muted-foreground text-sm line-clamp-2 mb-8 leading-relaxed h-10">
                                        {room.description || "Active community session focusing on deep architectural exploration and study patterns."}
                                    </p>

                                    <div className="mt-auto pt-8 border-t border-white/5 flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="flex items-center gap-1.5">
                                                <Users size={16} className="text-primary" />
                                                <span className="text-xs font-black">{room._count?.members || 0}</span>
                                            </div>
                                            <div className="flex items-center gap-1.5">
                                                <Zap size={16} className="text-amber-400" />
                                                <span className="text-xs font-black">ACTIVE Hub</span>
                                            </div>
                                        </div>

                                        <div className="p-3 bg-primary/10 text-primary rounded-xl group-hover:bg-primary group-hover:text-white transition-all">
                                            <ArrowRight size={18} />
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </main>
        </div >
    );
}
