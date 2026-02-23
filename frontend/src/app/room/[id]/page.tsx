"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
    Send,
    Users,
    Settings,
    Timer,
    Layout,
    Pencil,
    Eraser,
    Download,
    MoreVertical,
    LogOut,
    Maximize2,
    MessageSquare,
    BrainCircuit,
    Layers,
    Trophy,
    Home,
    Mic,
    Video,
    Share2,
    Hand,
    Plus,
    X,
    UserPlus,
    Shield,
    ShieldCheck,
    UserCircle
} from "lucide-react";
import { socketService } from "@/services/socketService";
import { useAuthStore } from "@/store/useAuthStore";
import { Pomodoro } from "@/components/Pomodoro";
import { Whiteboard } from "@/components/Whiteboard";
import { AIAssistant } from "@/components/AIAssistant";
import { Flashcards } from "@/components/Flashcards";
import { Quiz } from "@/components/Quiz";
import { SessionScheduler } from "@/components/SessionScheduler";

export default function StudyRoom() {
    const { id: roomCode } = useParams();
    const { user, token } = useAuthStore();
    const router = useRouter();
    const [messages, setMessages] = useState<any[]>([]);
    const [message, setMessage] = useState("");
    const [room, setRoom] = useState<any>(null);
    const [activeTab, setActiveTab] = useState("whiteboard");
    const [isRightSidebarOpen, setIsRightSidebarOpen] = useState(true);
    const [content, setContent] = useState<any>({ decks: [], quizzes: [] });
    const [isMuted, setIsMuted] = useState(true);
    const [isVideoOff, setIsVideoOff] = useState(true);

    const chatEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!token) {
            router.push("/login");
            return;
        }

        const fetchData = async () => {
            try {
                const roomRes = await fetch(`http://localhost:5000/api/rooms/${roomCode}`);
                const roomData = await roomRes.json();
                if (roomRes.ok) {
                    setRoom(roomData);
                    const socket = socketService.connect();
                    socketService.joinRoom(roomData.id);

                    // Fetch content
                    const contentRes = await fetch(`http://localhost:5000/api/content/flashcards/room/${roomData.id}`);
                    const decks = await contentRes.json();

                    const quizRes = await fetch(`http://localhost:5000/api/content/quizzes/room/${roomData.id}`);
                    const quizzes = await quizRes.json();

                    setContent({ decks, quizzes });
                } else {
                    router.push("/dashboard");
                }
            } catch (err) {
                console.error(err);
            }
        };

        fetchData();

        socketService.onReceiveMessage((msg) => {
            setMessages((prev) => [...prev, msg]);
        });

        return () => {
            socketService.disconnect();
        };
    }, [roomCode, token, router]);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (!message.trim() || !room) return;

        socketService.sendMessage(room.id, message, user?.name || "Anonymous");
        setMessage("");
    };

    const handleUpdateRole = async (targetUserId: string, newRole: string) => {
        try {
            const res = await fetch('http://localhost:5000/api/rooms/role', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ roomId: room.id, userId: targetUserId, role: newRole })
            });
            if (res.ok) {
                // Refresh room data to reflect role changes
                const updatedRes = await fetch(`http://localhost:5000/api/rooms/${roomCode}`);
                const updatedData = await updatedRes.json();
                setRoom(updatedData);
            } else {
                const err = await res.json();
                alert(err.message);
            }
        } catch (err) {
            console.error(err);
        }
    };

    const isAdmin = room?.members?.some((m: any) => m.id === user?.id && (m.role === 'ADMIN' || m.role === 'MODERATOR'));
    const userRole = room?.members?.find((m: any) => m.id === user?.id)?.role || 'MEMBER';

    if (!room) return null;

    const navItems = [
        { id: "whiteboard", icon: Layout, label: "Canvas" },
        { id: "ai", icon: BrainCircuit, label: "AI Co-pilot" },
        { id: "flashcards", icon: Layers, label: "Flashcards" },
        { id: "schedule", icon: Timer, label: "Schedule" },
    ];

    return (
        <div className="h-screen flex bg-background text-foreground overflow-hidden relative">
            {/* AMBIENT BACKGROUND AURA (The Color Factor) */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
                <div className="absolute -top-[20%] -left-[10%] w-[60%] h-[60%] bg-primary/20 rounded-full blur-[120px] animate-pulse opacity-50" />
                <div className="absolute -bottom-[20%] -right-[10%] w-[50%] h-[50%] bg-emerald-500/10 rounded-full blur-[120px] animate-pulse opacity-30 [animation-delay:2s]" />
                <div className="absolute top-[30%] left-[20%] w-[30%] h-[30%] bg-rose-500/5 rounded-full blur-[100px] animate-pulse opacity-20 [animation-delay:4s]" />
            </div>

            {/* COLUMN 1: Narrow Navigation Sidebar (Elite Glass) */}
            <aside className="w-24 lg:w-64 border-r border-white/10 bg-black/40 backdrop-blur-[40px] flex flex-col py-10 z-30 transition-all duration-700 relative overflow-hidden group/sidebar shadow-2xl">
                {/* Sidebar Inner Glow */}
                <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-primary/10 to-transparent pointer-events-none opacity-40" />

                <div className="px-6 mb-16 relative z-10">
                    <Link href="/dashboard" className="flex items-center justify-center lg:justify-start gap-4 p-3.5 bg-white/5 border border-white/10 rounded-2xl hover:bg-primary hover:text-white transition-all group/home shadow-lg hover:shadow-primary/30 active:scale-95">
                        <Home size={22} className="group-hover/home:rotate-12 transition-transform" />
                        <span className="hidden lg:block text-[10px] font-black uppercase tracking-[0.2em] group-hover:opacity-100">Portal</span>
                    </Link>
                </div>

                <div className="flex-1 flex flex-col gap-3 px-4 relative z-10">
                    {navItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => setActiveTab(item.id)}
                            className={`w-full lg:h-14 aspect-square lg:aspect-auto rounded-2xl flex items-center justify-center lg:justify-start gap-5 lg:px-6 transition-all group relative overflow-hidden ${activeTab === item.id
                                ? 'bg-primary text-white shadow-2xl shadow-primary/30 ring-1 ring-white/20'
                                : 'text-muted-foreground hover:bg-white/5 hover:text-white'
                                }`}
                        >
                            {activeTab === item.id && (
                                <motion.div layoutId="nav-glow" className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent opacity-40" />
                            )}
                            <item.icon size={20} className="relative z-10 group-hover:scale-110 transition-transform" />
                            <span className="hidden lg:block text-[10px] font-black uppercase tracking-[0.2em] relative z-10">{item.label}</span>
                        </button>
                    ))}
                </div>

                <div className="px-6 pt-10 border-t border-white/10 relative z-10">
                    <button
                        onClick={() => router.push('/dashboard')}
                        className="w-full h-14 flex items-center justify-center lg:justify-start gap-5 lg:px-6 text-muted-foreground/60 hover:text-rose-500 transition-all group hover:bg-rose-500/5 rounded-2xl"
                    >
                        <LogOut size={22} className="group-hover:-translate-x-1 transition-transform" />
                        <span className="hidden lg:block text-[10px] font-black uppercase tracking-[0.4em] opacity-80">Exit Hub</span>
                    </button>
                </div>
            </aside>

            {/* COLUMN 2: Main Workspace Canvas */}
            <main className="flex-1 flex flex-col relative overflow-hidden bg-card/10">
                {/* Internal Room Header */}
                <header className="h-20 px-8 flex items-center justify-between border-b border-white/5 bg-background/50 backdrop-blur-md sticky top-0 z-20">
                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-4 border-r border-white/10 pr-6">
                            <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center text-primary font-black text-xl">
                                {room.name[0]}
                            </div>
                            <div>
                                <h1 className="text-sm font-black uppercase tracking-tight">{room.name}</h1>
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                                    <span className="text-[8px] font-black text-muted-foreground uppercase tracking-widest">LIVE SESSION</span>
                                </div>
                            </div>
                        </div>

                        {/* Persistent Schedule Widget */}
                        <div className="hidden xl:flex items-center gap-3">
                            <div className="p-2 bg-white/5 rounded-lg border border-white/5">
                                <Timer size={14} className="text-primary" />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[8px] font-black opacity-30 uppercase">Next Session</span>
                                <span className="text-[9px] font-bold uppercase">System Review @ 4:00 PM</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="hidden lg:block border-x border-white/10 px-6">
                            <Pomodoro />
                        </div>
                        <button
                            onClick={() => setIsRightSidebarOpen(!isRightSidebarOpen)}
                            className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all ${isRightSidebarOpen ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'bg-white/5 text-muted-foreground hover:bg-white/10 hover:text-white'}`}
                        >
                            <MessageSquare size={16} />
                            <span className="text-[10px] font-black uppercase tracking-widest">Hub Intel</span>
                        </button>
                    </div>
                </header>

                {/* THE STAGE: Participant Grid */}
                <div className="h-44 px-8 flex items-center gap-6 overflow-x-auto bg-black/40 border-b border-white/5 no-scrollbar z-10 py-6">
                    {room.members.map((m: any) => (
                        <motion.div
                            key={m.id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className={`min-w-[160px] aspect-video bg-card/60 backdrop-blur-xl border ${(!isMuted && m.id === user?.id) ? 'border-primary ring-1 ring-primary/30 shadow-[0_0_30px_rgba(var(--primary-rgb),0.4)]' : 'border-white/10'} rounded-2xl relative overflow-hidden flex flex-col items-center justify-center group transition-all duration-500 hover:scale-105 shadow-2xl`}
                        >
                            <div className={`w-14 h-14 ${(!isMuted && m.id === user?.id) ? 'bg-primary ring-4 ring-primary/20' : 'bg-primary/10 border border-primary/20'} rounded-2xl flex items-center justify-center text-lg font-black text-white mb-3 shadow-inner transition-all transform group-hover:rotate-3`}>
                                {m.name[0]}
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-widest text-white/90">{m.name}</span>
                            <div className="mt-2 flex items-center gap-1.5">
                                <span className={`text-[8px] font-black px-2 py-0.5 rounded-full flex items-center gap-1 ${m.role === 'ADMIN' ? 'bg-amber-500/20 text-amber-500 border border-amber-500/20' : m.role === 'MODERATOR' ? 'bg-indigo-500/20 text-indigo-500 border border-indigo-500/20' : 'bg-white/5 text-muted-foreground'} uppercase tracking-tighter`}>
                                    {(m.role === 'ADMIN' || m.role === 'MODERATOR') && <Shield size={8} />}
                                    {m.role || 'Member'}
                                </span>
                            </div>

                            {/* Status Overlay */}
                            <div className="absolute top-4 right-4 flex gap-2">
                                <div className={`p-1.5 rounded-lg transition-all ${(isMuted && m.id === user?.id) ? 'bg-rose-500/20 text-rose-500' : 'bg-emerald-500/20 text-emerald-500 opacity-0 group-hover:opacity-100 animate-bounce-subtle'}`}>
                                    <Mic size={12} strokeWidth={3} />
                                </div>
                            </div>

                            {/* Admin Controls Overlay */}
                            {isAdmin && m.id !== user?.id && (
                                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 backdrop-blur-sm">
                                    <button
                                        onClick={() => handleUpdateRole(m.id, 'MODERATOR')}
                                        className="p-2 bg-indigo-500 text-white rounded-lg hover:scale-110 transition-transform shadow-lg shadow-indigo-500/20"
                                        title="Make Moderator"
                                    >
                                        <Shield size={14} />
                                    </button>
                                    <button
                                        onClick={() => handleUpdateRole(m.id, 'ADMIN')}
                                        className="p-2 bg-amber-500 text-white rounded-lg hover:scale-110 transition-transform shadow-lg shadow-amber-500/20"
                                        title="Make Admin"
                                    >
                                        <ShieldCheck size={14} />
                                    </button>
                                    <button
                                        onClick={() => handleUpdateRole(m.id, 'MEMBER')}
                                        className="p-2 bg-white/10 text-white rounded-lg hover:scale-110 transition-transform"
                                        title="Demote to Member"
                                    >
                                        <UserCircle size={14} />
                                    </button>
                                </div>
                            )}
                        </motion.div>
                    ))}
                    <button
                        onClick={() => {
                            const url = `${window.location.origin}/room/${room.code}`;
                            navigator.clipboard.writeText(url);
                            alert("Invite link copied! Send this to your co-organizer.");
                        }}
                        className="min-w-[160px] aspect-video border-2 border-dashed border-white/10 rounded-2xl flex flex-col items-center justify-center text-muted-foreground hover:border-primary/40 hover:text-white hover:bg-white/5 transition-all group opacity-60 hover:opacity-100"
                    >
                        <UserPlus size={28} className="mb-2 group-hover:scale-110 transition-transform text-primary" />
                        <span className="text-[10px] font-black uppercase tracking-widest">Add Organizer</span>
                    </button>
                </div>

                <div className="flex-1 relative overflow-hidden flex items-center justify-center p-4">
                    {activeTab === "whiteboard" && <Whiteboard roomId={room.id} />}
                    {activeTab === "ai" && <AIAssistant isAdmin={isAdmin} onContentUpdate={() => {
                        // Re-fetch content
                        const fetchContent = async () => {
                            const contentRes = await fetch(`http://localhost:5000/api/content/flashcards/room/${room.id}`);
                            const decks = await contentRes.json();
                            const quizRes = await fetch(`http://localhost:5000/api/content/quizzes/room/${room.id}`);
                            const quizzes = await quizRes.json();
                            setContent({ decks, quizzes });
                        };
                        fetchContent();
                    }} />}
                    {activeTab === "flashcards" && (
                        <div className="w-full h-full max-w-4xl flex items-center justify-center">
                            {content.decks.length > 0 ? (
                                <Flashcards decks={content.decks} />
                            ) : (
                                <div className="text-center p-20 border-2 border-dashed border-white/5 rounded-[3rem] opacity-40 hover:border-primary/20 transition-all">
                                    <Layers size={48} className="mx-auto mb-4 text-primary" />
                                    <p className="font-bold uppercase tracking-[0.2em] text-[10px]">No decks found</p>
                                </div>
                            )}
                        </div>
                    )}
                    {activeTab === "schedule" && <SessionScheduler roomId={room.id} />}
                </div>

                {/* BOTTOM CONTROL BAR (Winning Hardware-style UI) */}
                <footer className="h-24 px-8 border-t border-white/5 bg-background flex items-center justify-center">
                    <div className="bg-card/50 backdrop-blur-xl w-full max-w-4xl px-12 h-16 rounded-3xl border border-white/10 shadow-2xl flex items-center justify-between pointer-events-auto">
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => setIsMuted(!isMuted)}
                                className={`h-12 w-12 rounded-2xl flex items-center justify-center transition-all ${isMuted ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/20' : 'bg-white/5 text-muted-foreground hover:bg-white/10 hover:text-white'}`}
                            >
                                <Mic size={20} />
                            </button>
                            <button
                                onClick={() => setIsVideoOff(!isVideoOff)}
                                className={`h-12 w-12 rounded-2xl flex items-center justify-center transition-all ${isVideoOff ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/20' : 'bg-white/5 text-muted-foreground hover:bg-white/10 hover:text-white'}`}
                            >
                                <Video size={20} />
                            </button>
                        </div>

                        <div className="flex items-center gap-6">
                            <div className="h-8 w-px bg-white/10" />
                            <button
                                onClick={() => {
                                    navigator.clipboard.writeText(window.location.href);
                                    // Custom toast/feedback instead of alert
                                }}
                                className="px-8 py-3 bg-primary text-primary-foreground rounded-2xl font-black uppercase text-[10px] tracking-widest flex items-center gap-3 hover:shadow-lg hover:shadow-primary/20 active:scale-95 transition-all"
                            >
                                <Share2 size={16} />
                                Share Hub Intel
                            </button>
                            <button
                                onClick={() => {
                                    socketService.sendMessage(room.id, "✋ Raised hand", user?.name || "Anonymous");
                                }}
                                className="h-12 w-12 bg-white/5 text-emerald-400 rounded-2xl hover:bg-emerald-400 hover:text-white transition-all flex items-center justify-center"
                            >
                                <Hand size={20} />
                            </button>
                            <div className="h-8 w-px bg-white/10" />
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="hidden sm:flex -space-x-3 overflow-hidden">
                                {room.members.slice(0, 3).map((m: any, i: number) => (
                                    <div key={m.id} className={`inline-block h-8 w-8 rounded-full ring-2 ring-card bg-primary/20 flex items-center justify-center text-[10px] font-black uppercase border border-white/10 shadow-lg`} style={{ zIndex: 10 - i }}>
                                        {m.name[0]}
                                    </div>
                                ))}
                            </div>
                            <button
                                className="h-12 w-12 bg-white/5 text-muted-foreground rounded-2xl hover:bg-white/10 transition-all flex items-center justify-center"
                            >
                                <MoreVertical size={20} />
                            </button>
                        </div>
                    </div>
                </footer>
            </main>

            {/* COLUMN 3: Right Context/Chat Sidebar */}
            <AnimatePresence>
                {isRightSidebarOpen && (
                    <motion.aside
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{ type: "spring", damping: 20 }}
                        className="w-96 border-l border-white/5 bg-card flex flex-col z-20 shadow-2xl shadow-black/50"
                    >
                        <header className="h-20 px-6 flex items-center justify-between border-b border-white/5">
                            <div className="flex items-center gap-3">
                                <MessageSquare size={20} className="text-primary" />
                                <h3 className="text-sm font-black uppercase tracking-widest">Hub Intel</h3>
                            </div>
                            <button onClick={() => setIsRightSidebarOpen(false)} className="text-muted-foreground hover:text-white transition-colors">
                                <X size={20} />
                            </button>
                        </header>

                        <div className="flex-1 flex flex-col overflow-hidden">
                            <div className="flex-1 overflow-y-auto p-6 space-y-6">
                                {messages.length === 0 ? (
                                    <div className="h-full flex flex-col items-center justify-center text-center px-8 relative">
                                        <div className="absolute inset-0 bg-primary/5 blur-[50px] rounded-full scale-50 opacity-20" />
                                        <MessageSquare size={48} className="mb-6 text-primary/40 animate-pulse" />
                                        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground/40">Secure Intel Feed</p>
                                        <span className="text-[8px] mt-2 text-muted-foreground/20 font-bold uppercase">End-to-end synchronized</span>
                                    </div>
                                ) : (
                                    messages.map((msg, i) => {
                                        const sender = room?.members?.find((m: any) => m.name === msg.userName);
                                        const isAdminMsg = sender?.role === 'ADMIN' || sender?.role === 'MODERATOR';
                                        const isMyMsg = msg.userName === user?.name;

                                        return (
                                            <motion.div
                                                key={i}
                                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                                className={`flex flex-col ${isMyMsg ? 'items-end' : 'items-start'}`}
                                            >
                                                <div className={`flex items-center gap-2 mb-1.5 px-2 ${isMyMsg ? 'flex-row-reverse' : ''}`}>
                                                    <span className="text-[8px] font-black text-muted-foreground uppercase tracking-wider">{msg.userName}</span>
                                                    {isAdminMsg && (
                                                        <span className="text-[7px] font-black bg-primary/20 text-primary px-2 py-0.5 rounded-full uppercase tracking-tighter border border-primary/20 backdrop-blur-sm">Organizer</span>
                                                    )}
                                                </div>
                                                <div className={`group relative px-5 py-3.5 rounded-2xl text-[13px] font-medium leading-relaxed max-w-[90%] transition-all ${isMyMsg
                                                    ? 'bg-gradient-to-br from-primary to-primary/80 text-primary-foreground rounded-tr-none shadow-xl shadow-primary/20 border border-primary/20'
                                                    : 'bg-white/5 border border-white/10 rounded-tl-none backdrop-blur-md hover:bg-white/10'
                                                    }`}>
                                                    {msg.type === 'file' && msg.fileUrl && (
                                                        <a href={msg.fileUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 bg-black/40 rounded-xl mb-2.5 hover:bg-black/60 transition-all border border-white/5 ring-1 ring-white/5 shadow-inner">
                                                            <div className="p-2 bg-primary/20 rounded-lg text-primary">
                                                                <Download size={14} />
                                                            </div>
                                                            <div className="flex flex-col overflow-hidden">
                                                                <span className="truncate max-w-[150px] font-black uppercase text-[9px] tracking-widest">{msg.content}</span>
                                                                <span className="text-[7px] opacity-40 uppercase font-bold">Encrypted Intel</span>
                                                            </div>
                                                        </a>
                                                    )}
                                                    {msg.content}

                                                    {/* Glow effect on hover for others' messages */}
                                                    {!isMyMsg && <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl blur-md -z-10" />}
                                                </div>
                                            </motion.div>
                                        );
                                    })
                                )}
                                <div ref={chatEndRef} />
                            </div>

                            <footer className="p-6 bg-background/50 backdrop-blur-xl border-t border-white/5">
                                <form onSubmit={handleSendMessage} className="space-y-4">
                                    <div className="relative group">
                                        <div className="absolute inset-0 bg-primary/5 blur-xl group-focus-within:bg-primary/10 transition-all rounded-2xl" />
                                        <input
                                            type="text"
                                            value={message}
                                            onChange={(e) => setMessage(e.target.value)}
                                            placeholder="Broadcast to hub..."
                                            className="w-full h-14 pl-12 pr-4 bg-white/5 border border-white/10 rounded-2xl text-[13px] font-medium focus:border-primary/50 focus:ring-4 focus:ring-primary/5 transition-all outline-none relative z-10 placeholder:text-muted-foreground/40"
                                        />
                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/60 group-focus-within:text-primary transition-all z-20 group-focus-within:scale-110">
                                            <Send size={18} />
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <label className="flex-1 flex items-center justify-center gap-3 h-12 bg-white/5 border border-white/10 rounded-2xl cursor-pointer hover:bg-white/10 transition-all group relative overflow-hidden">
                                            <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/5 to-primary/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                                            <input
                                                type="file"
                                                className="hidden"
                                                onChange={async (e) => {
                                                    const file = e.target.files?.[0];
                                                    if (file) {
                                                        const reader = new FileReader();
                                                        reader.onloadend = () => {
                                                            const base64 = reader.result as string;
                                                            const type = file.type.startsWith('image/') ? 'image' : 'file';
                                                            socketService.sendMessage(room.id, file.name, user?.name || "Anonymous", type, base64);
                                                        };
                                                        reader.readAsDataURL(file);
                                                    }
                                                }}
                                            />
                                            <Plus size={16} className="text-primary/60 group-hover:text-primary group-hover:rotate-90 transition-all" />
                                            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 group-hover:text-primary transition-colors">Deploy Intel</span>
                                        </label>
                                    </div>
                                </form>
                            </footer>
                        </div>
                    </motion.aside>
                )}
            </AnimatePresence>
        </div>
    );
}
