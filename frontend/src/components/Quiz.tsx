"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, XCircle, Trophy, Star } from "lucide-react";

interface Question {
    question: string;
    options: string[];
    correctAnswer: number;
}

interface QuizProps {
    title: string;
    questions: Question[];
    onComplete?: (score: number) => void;
}

export const Quiz = ({ title, questions, onComplete }: QuizProps) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedOption, setSelectedOption] = useState<number | null>(null);
    const [score, setScore] = useState(0);
    const [showResult, setShowResult] = useState(false);

    const handleOptionSelect = (index: number) => {
        if (selectedOption !== null) return;
        setSelectedOption(index);
        if (index === questions[currentIndex].correctAnswer) {
            setScore((prev) => prev + 1);
        }

        setTimeout(() => {
            if (currentIndex < questions.length - 1) {
                setCurrentIndex((prev) => prev + 1);
                setSelectedOption(null);
            } else {
                setShowResult(true);
                onComplete?.(score + (index === questions[currentIndex].correctAnswer ? 1 : 0));
            }
        }, 1500);
    };

    if (showResult) {
        const percentage = (score / questions.length) * 100;
        const isMaster = percentage === 100;

        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className="p-12 text-center bg-card/40 backdrop-blur-3xl border border-white/10 rounded-[3rem] shadow-[0_0_50px_rgba(0,0,0,0.5)] relative overflow-hidden"
            >
                {/* Background Celebration Rays */}
                <div className={`absolute inset-0 pointer-events-none opacity-20 ${isMaster ? 'bg-[conic-gradient(from_0deg,transparent,rgba(251,191,36,0.3),transparent)] animate-[spin_8s_linear_infinite]' : ''}`} />

                <motion.div
                    initial={{ rotate: -20, scale: 0.5 }}
                    animate={{ rotate: 0, scale: 1 }}
                    transition={{ type: "spring", damping: 10 }}
                    className={`w-24 h-24 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-2xl ${isMaster ? 'bg-amber-500 text-white shadow-amber-500/40' : 'bg-primary/20 text-primary'}`}
                >
                    <Trophy size={48} className={isMaster ? 'animate-bounce' : ''} />
                </motion.div>

                <h2 className="text-4xl font-black font-outfit mb-4 bg-gradient-to-br from-white to-white/60 bg-clip-text text-transparent">
                    {isMaster ? 'PERFECT SCORE!' : 'Quiz Complete!'}
                </h2>
                <p className="text-muted-foreground text-sm font-black uppercase tracking-[0.3em] mb-10">
                    INTELLIGENCE ASSESSMENT VERIFIED
                </p>

                <div className="flex flex-col items-center gap-2 mb-10">
                    <div className="text-7xl font-black text-primary drop-shadow-[0_0_20px_rgba(var(--primary-rgb),0.3)]">
                        {score}<span className="text-3xl opacity-20 mx-2">/</span>{questions.length}
                    </div>
                    <div className="h-2 w-48 bg-white/5 rounded-full overflow-hidden border border-white/5">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${percentage}%` }}
                            transition={{ duration: 1.5, ease: "easeOut" }}
                            className={`h-full ${isMaster ? 'bg-amber-500' : 'bg-primary'}`}
                        />
                    </div>
                </div>

                <div className="flex gap-4 justify-center">
                    <button
                        onClick={() => {
                            setCurrentIndex(0);
                            setScore(0);
                            setSelectedOption(null);
                            setShowResult(false);
                        }}
                        className="px-10 py-4 bg-primary text-white rounded-2xl font-black uppercase text-[10px] tracking-widest hover:shadow-xl hover:shadow-primary/20 active:scale-95 transition-all"
                    >
                        Retake Assessment
                    </button>
                </div>
            </motion.div>
        );
    }

    const currentQuestion = questions[currentIndex];

    return (
        <div className="p-6 bg-card border rounded-[2rem] shadow-xl w-full max-w-lg">
            <div className="flex justify-between items-center mb-8">
                <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">{title}</h3>
                <div className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-bold">
                    Question {currentIndex + 1} / {questions.length}
                </div>
            </div>

            <h2 className="text-xl font-bold font-outfit mb-8 leading-tight">
                {currentQuestion.question}
            </h2>

            <div className="space-y-3">
                {currentQuestion.options.map((option, i) => {
                    const isSelected = selectedOption === i;
                    const isCorrect = i === currentQuestion.correctAnswer;
                    const showColors = selectedOption !== null;

                    return (
                        <button
                            key={i}
                            onClick={() => handleOptionSelect(i)}
                            disabled={selectedOption !== null}
                            className={`w-full p-4 rounded-2xl border-2 text-left font-medium transition-all flex items-center justify-between ${isSelected
                                ? isCorrect ? 'border-green-500 bg-green-500/10' : 'border-red-500 bg-red-500/10'
                                : showColors && isCorrect ? 'border-green-500 bg-green-500/10' : 'border-transparent bg-muted/50 hover:bg-muted'
                                }`}
                        >
                            {option}
                            {showColors && isCorrect && <CheckCircle2 className="text-green-500" size={20} />}
                            {showColors && isSelected && !isCorrect && <XCircle className="text-red-500" size={20} />}
                        </button>
                    );
                })}
            </div>
        </div>
    );
};
