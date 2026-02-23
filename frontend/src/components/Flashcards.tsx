"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, RotateCcw } from "lucide-react";

interface Card {
    front: string;
    back: string;
}

interface FlashcardsProps {
    decks: { title: string, cards: Card[] }[];
    onSelect?: (index: number) => void;
}

export const Flashcards = ({ decks, onSelect }: FlashcardsProps) => {
    const [deckIndex, setDeckIndex] = useState(0);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);

    const cards = decks[deckIndex]?.cards || [];

    if (!cards.length) return <div className="p-8 text-center text-muted-foreground">No cards in this deck.</div>;

    const nextCard = () => {
        setIsFlipped(false);
        setTimeout(() => {
            setCurrentIndex((prev) => (prev + 1) % cards.length);
        }, 150);
    };

    const prevCard = () => {
        setIsFlipped(false);
        setTimeout(() => {
            setCurrentIndex((prev) => (prev - 1 + cards.length) % cards.length);
        }, 150);
    };

    return (
        <div className="flex flex-col items-center gap-6 p-4 w-full">
            {decks.length > 1 && (
                <div className="flex gap-2 mb-4 overflow-x-auto p-2 no-scrollbar max-w-full">
                    {decks.map((deck, i) => (
                        <button
                            key={i}
                            onClick={() => {
                                setDeckIndex(i);
                                setCurrentIndex(0);
                                setIsFlipped(false);
                            }}
                            className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all ${deckIndex === i ? 'bg-primary text-white shadow-lg' : 'bg-white/5 text-muted-foreground hover:bg-white/10'}`}
                        >
                            {deck.title}
                        </button>
                    ))}
                </div>
            )}

            <div className="relative w-full max-w-sm h-64 perspective-1000">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentIndex + (isFlipped ? "-back" : "-front")}
                        initial={{ rotateY: isFlipped ? -90 : 90, opacity: 0 }}
                        animate={{ rotateY: 0, opacity: 1 }}
                        exit={{ rotateY: isFlipped ? 90 : -90, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        onClick={() => setIsFlipped(!isFlipped)}
                        className="w-full h-full bg-card border-2 border-primary/20 rounded-[2rem] shadow-xl flex items-center justify-center p-8 text-center cursor-pointer hover:border-primary/50 transition-colors"
                    >
                        <div className="text-xl font-bold font-outfit">
                            {isFlipped ? cards[currentIndex].back : cards[currentIndex].front}
                        </div>
                        <div className="absolute bottom-4 right-6 text-[10px] uppercase font-bold text-muted-foreground tracking-widest">
                            {isFlipped ? "Back" : "Front"} - Click to Flip
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>

            <div className="flex items-center gap-4">
                <button onClick={prevCard} className="p-3 bg-secondary rounded-xl hover:bg-secondary/80 flex items-center justify-center">
                    <ChevronLeft size={20} />
                </button>
                <div className="text-sm font-bold font-mono">
                    {currentIndex + 1} / {cards.length}
                </div>
                <button onClick={nextCard} className="p-3 bg-secondary rounded-xl hover:bg-secondary/80 flex items-center justify-center">
                    <ChevronRight size={20} />
                </button>
            </div>
        </div>
    );
};
