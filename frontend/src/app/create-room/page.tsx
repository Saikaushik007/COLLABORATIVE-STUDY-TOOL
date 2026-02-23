"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Layers, Globe, Lock, ArrowLeft, Home } from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import Link from "next/link";

export default function CreateRoom() {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [type, setType] = useState("PUBLIC");
    const [category, setCategory] = useState("Deep Work");
    const [loading, setLoading] = useState(false);
    const { token } = useAuthStore();
    const router = useRouter();

    const categories = ["Deep Work", "Computer Science", "Engineering", "Mathematics", "AI Research", "Social", "Other"];

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch("http://localhost:5000/api/rooms", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ name, description, type, category }),
            });

            const data = await res.json();
            console.log("ROOM_CREATE_RESPONSE:", data);
            if (res.ok) {
                router.push(`/room/${data.code}`);
            } else {
                alert(data.message || "Failed to create room. Please check your connection.");
            }
        } catch (err) {
            console.error("ROOM_CREATE_NETWORK_ERROR:", err);
            alert("A network error occurred. Please ensure the backend is running.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-muted/30 pt-32 pb-20 p-4">
            <div className="container mx-auto max-w-2xl">
                <Link href="/dashboard" className="flex items-center gap-2 text-muted-foreground hover:text-white mb-8 transition-colors">
                    <ArrowLeft size={20} />
                    Back to Dashboard
                </Link>

                <motion.div
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-card border border-white/5 rounded-[2.5rem] p-8 md:p-12 shadow-2xl"
                >
                    <div className="mb-10">
                        <h1 className="text-3xl font-bold font-outfit mb-2 uppercase tracking-tight">Create Study Hub</h1>
                        <p className="text-muted-foreground">Setup your room and invite your friends or study with the community.</p>
                    </div>

                    <form onSubmit={handleCreate} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-bold mb-3 ml-1 uppercase tracking-widest text-primary">Room Name</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl focus:ring-2 focus:ring-primary/20 outline-none transition-all font-medium"
                                    placeholder="e.g., Deep Work: Algorithm prep"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold mb-3 ml-1 uppercase tracking-widest text-primary">Category</label>
                                <select
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                    className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl focus:ring-2 focus:ring-primary/20 outline-none transition-all font-medium appearance-none cursor-pointer"
                                >
                                    {categories.map(cat => (
                                        <option key={cat} value={cat} className="bg-zinc-900">{cat}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-bold mb-3 ml-1 uppercase tracking-widest text-primary">Description (Optional)</label>
                            <textarea
                                className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl focus:ring-2 focus:ring-primary/20 outline-none transition-all min-h-[120px]"
                                placeholder="What are we studying today?"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <button
                                type="button"
                                onClick={() => setType("PUBLIC")}
                                className={`p-5 rounded-2xl border-2 transition-all text-left flex flex-col gap-3 ${type === "PUBLIC" ? "border-primary bg-primary/5 ring-4 ring-primary/5" : "border-white/5 bg-white/5"
                                    }`}
                            >
                                <Globe size={24} className={type === "PUBLIC" ? "text-primary" : "text-muted-foreground"} />
                                <div>
                                    <div className="font-bold">Public Hub</div>
                                    <div className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">Visible globally</div>
                                </div>
                            </button>
                            <button
                                type="button"
                                onClick={() => setType("PRIVATE")}
                                className={`p-5 rounded-2xl border-2 transition-all text-left flex flex-col gap-3 ${type === "PRIVATE" ? "border-primary bg-primary/5 ring-4 ring-primary/5" : "border-white/5 bg-white/5"
                                    }`}
                            >
                                <Lock size={24} className={type === "PRIVATE" ? "text-primary" : "text-muted-foreground"} />
                                <div>
                                    <div className="font-bold">Private Hub</div>
                                    <div className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">Secure & Invite only</div>
                                </div>
                            </button>
                        </div>

                        <button
                            disabled={loading}
                            className="w-full py-5 bg-primary text-primary-foreground rounded-2xl font-black uppercase tracking-widest hover:shadow-xl hover:shadow-primary/30 transition-all disabled:opacity-50 text-lg mt-4"
                        >
                            {loading ? "INITIALIZING HUB..." : "Launch Study Hub"}
                        </button>
                    </form>
                </motion.div>
            </div>
        </div>
    );
}
