"use client";

import { useState } from "react";
import { Bot, Sparkles, Send, BrainCircuit } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useParams } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";

export const AIAssistant = ({ isAdmin, onContentUpdate }: { isAdmin?: boolean, onContentUpdate?: () => void }) => {
    const { id: roomId } = useParams();
    const { token } = useAuthStore();
    const [query, setQuery] = useState("");
    const [messages, setMessages] = useState([
        { role: "assistant", content: "Hi! I'm your Study Assistant. I'm now powered by Gemini! How can I help you today? I can summarize notes or explain complex topics." }
    ]);
    const [isLoading, setIsLoading] = useState(false);

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!query.trim()) return;

        const userMessage = { role: "user", content: query };
        setMessages((prev) => [...prev, userMessage]);
        setQuery("");
        setIsLoading(true);

        try {
            console.log("AI_CHAT_REQUEST:", { roomId, hasToken: !!token });
            const res = await fetch('http://localhost:5000/api/ai/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ prompt: query, roomId })
            });
            const data = await res.json();

            if (res.ok) {
                setMessages((prev) => [...prev, {
                    role: "assistant",
                    content: data.response
                }]);
            } else {
                throw new Error(data.error || "Failed to get AI response");
            }
        } catch (error: any) {
            setMessages((prev) => [...prev, {
                role: "assistant",
                content: `Error: ${error.message}`
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSummarize = async () => {
        setIsLoading(true);
        try {
            console.log("AI_SUMMARIZE_REQUEST:", { roomId });
            const res = await fetch('http://localhost:5000/api/ai/summarize', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ roomId })
            });
            const data = await res.json();

            if (res.ok) {
                setMessages(prev => [...prev, {
                    role: "assistant",
                    content: `📝 **Session Intelligence Summary:**\n\n${data.summary}`
                }]);
            } else {
                throw new Error(data.error);
            }
        } catch (error: any) {
            setMessages(prev => [...prev, {
                role: "assistant",
                content: `Failed to synthesize summary: ${error.message}`
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-full bg-card/10">
            <div className="p-6 border-b flex items-center justify-between">
                <h3 className="font-bold flex items-center gap-2 text-primary font-outfit">
                    <BrainCircuit size={20} />
                    AI Assistant
                </h3>
                <Sparkles size={16} className="text-yellow-500 animate-pulse" />
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {isAdmin && (
                    <div className="flex justify-center gap-2 mb-2">
                        <button
                            onClick={handleSummarize}
                            className="text-[10px] font-bold uppercase tracking-widest bg-primary/10 text-primary px-4 py-2 rounded-full hover:bg-primary/20 transition-all border border-primary/20 shadow-sm"
                        >
                            Summarize
                        </button>
                    </div>
                )}
                {messages.map((msg, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, x: msg.role === "user" ? 10 : -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                    >
                        <div className={`max-w-[85%] p-4 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${msg.role === "user"
                            ? "bg-primary text-white rounded-tr-none shadow-lg shadow-primary/20"
                            : "bg-muted border rounded-tl-none"
                            }`}>
                            {msg.content}
                        </div>
                    </motion.div>
                ))}
                {isLoading && (
                    <div className="flex justify-start">
                        <div className="bg-muted border p-4 rounded-2xl rounded-tl-none animate-pulse">
                            <div className="flex gap-1">
                                <div className="w-1.5 h-1.5 bg-foreground/20 rounded-full animate-bounce" />
                                <div className="w-1.5 h-1.5 bg-foreground/20 rounded-full animate-bounce [animation-delay:0.2s]" />
                                <div className="w-1.5 h-1.5 bg-foreground/20 rounded-full animate-bounce [animation-delay:0.4s]" />
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <div className="p-4 border-t bg-card/50">
                <form onSubmit={handleSend} className="relative">
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Ask AI anything..."
                        className="w-full pl-4 pr-12 py-3 bg-muted/50 border rounded-2xl text-sm focus:ring-1 focus:ring-primary outline-none"
                    />
                    <button
                        disabled={isLoading}
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-primary text-white rounded-xl hover:scale-105 transition-transform shadow-lg shadow-primary/25 disabled:opacity-50"
                    >
                        <Send size={16} />
                    </button>
                </form>
            </div>
        </div>
    );
};
