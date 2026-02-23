"use client";

import React, { useRef, useEffect, useState } from 'react';
import { Pencil, Eraser, Download, Maximize2, RotateCcw, Square, Circle, StickyNote as StickyIcon, Type, X } from 'lucide-react';
import { socketService } from '@/services/socketService';

interface WhiteboardProps {
    roomId: string;
}

export const Whiteboard = ({ roomId }: WhiteboardProps) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const contextRef = useRef<CanvasRenderingContext2D | null>(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [color, setColor] = useState("#3b82f6");
    const [lineWidth, setLineWidth] = useState(3);
    const [tool, setTool] = useState<"pencil" | "eraser" | "square" | "circle" | "sticky">("pencil");
    const [stickies, setStickies] = useState<any[]>([]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        // Set display size
        const parent = canvas.parentElement;
        if (parent) {
            canvas.width = parent.clientWidth * 2;
            canvas.height = parent.clientHeight * 2;
            canvas.style.width = `${parent.clientWidth}px`;
            canvas.style.height = `${parent.clientHeight}px`;
        }

        const context = canvas.getContext('2d');
        if (context) {
            context.scale(2, 2);
            context.lineCap = "round";
            context.lineJoin = "round";
            context.strokeStyle = color;
            context.lineWidth = lineWidth;
            context.imageSmoothingEnabled = true;
            context.imageSmoothingQuality = 'high';
            contextRef.current = context as any;
        }

        // Handle incoming draw data
        socketService.onReceiveDrawData((data: any) => {
            if (!contextRef.current) return;
            const { x, y, lastX, lastY, color: remoteColor, width, tool: remoteTool, eraser } = data;

            const ctx = contextRef.current as any;
            ctx.beginPath();
            ctx.strokeStyle = (eraser || remoteTool === 'eraser') ? (document.documentElement.classList.contains('dark') ? '#18181b' : '#ffffff') : remoteColor;
            ctx.lineWidth = width;
            ctx.shadowBlur = 1;
            ctx.shadowColor = remoteColor;

            if (remoteTool === 'square') {
                ctx.strokeRect(lastX, lastY, x - lastX, y - lastY);
            } else if (remoteTool === 'circle') {
                const radius = Math.sqrt(Math.pow(x - lastX, 2) + Math.pow(y - lastY, 2));
                ctx.arc(lastX, lastY, radius, 0, 2 * Math.PI);
                ctx.stroke();
            } else {
                ctx.moveTo(lastX, lastY);
                ctx.lineTo(x, y);
                ctx.stroke();
            }
            ctx.closePath();
        });
    }, [color, lineWidth]);

    const [lastPos, setLastPos] = useState({ x: 0, y: 0 });

    const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
        const { x, y } = getCoordinates(e);
        setIsDrawing(true);
        setLastPos({ x, y });
    };

    const draw = (e: React.MouseEvent | React.TouchEvent) => {
        if (!isDrawing || !contextRef.current) return;
        const { x, y } = getCoordinates(e);

        const ctx = contextRef.current as any;
        ctx.beginPath();
        ctx.strokeStyle = tool === 'eraser' ? (document.documentElement.classList.contains('dark') ? '#18181b' : '#ffffff') : color;
        ctx.lineWidth = lineWidth;

        if (tool === 'pencil' || tool === 'eraser') {
            ctx.moveTo(lastPos.x, lastPos.y);
            ctx.lineTo(x, y);
            ctx.stroke();
        }
        // Note: For real-time shape preview, we'd need a buffer. 
        // For now, we simple emit the final shape on mouse up/move or just draw instantly.
        // Simplified: Draw as user moves for feedback
        if (tool === 'square') {
            // simplified instant draw
            ctx.strokeRect(lastPos.x, lastPos.y, x - lastPos.x, y - lastPos.y);
        } else if (tool === 'circle') {
            const radius = Math.sqrt(Math.pow(x - lastPos.x, 2) + Math.pow(y - lastPos.y, 2));
            ctx.arc(lastPos.x, lastPos.y, radius, 0, 2 * Math.PI);
            ctx.stroke();
        }

        ctx.closePath();

        // Emit to socket
        socketService.sendDrawData(roomId, {
            x, y,
            lastX: lastPos.x,
            lastY: lastPos.y,
            color,
            width: lineWidth,
            tool,
            eraser: tool === 'eraser'
        });

        if (tool === 'pencil' || tool === 'eraser') {
            setLastPos({ x, y });
        }
    };

    const stopDrawing = () => {
        setIsDrawing(false);
    };

    const getCoordinates = (e: React.MouseEvent | React.TouchEvent) => {
        const canvas = canvasRef.current!;
        const rect = canvas.getBoundingClientRect();

        let clientX, clientY;
        if ('touches' in e) {
            clientX = e.touches[0].clientX;
            clientY = e.touches[0].clientY;
        } else {
            clientX = e.clientX;
            clientY = e.clientY;
        }

        return {
            x: clientX - rect.left,
            y: clientY - rect.top
        };
    };

    const clearBoard = () => {
        const canvas = canvasRef.current;
        if (!canvas || !contextRef.current) return;
        const ctx = contextRef.current as any;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    };

    const downloadImage = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const link = document.createElement('a');
        link.download = 'whiteboard-session.png';
        link.href = canvas.toDataURL();
        link.click();
    };

    return (
        <div className="w-full h-full relative group">
            {/* Floating Toolbar */}
            <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 flex items-center gap-2 p-1.5 bg-card/80 backdrop-blur-xl border border-primary/20 rounded-2xl shadow-2xl opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                    onClick={() => setTool("pencil")}
                    className={`p-2.5 rounded-xl transition-all ${tool === 'pencil' ? 'bg-primary text-white' : 'hover:bg-primary/10'}`}
                >
                    <Pencil size={20} />
                </button>
                <button
                    onClick={() => setTool("eraser")}
                    className={`p-2.5 rounded-xl transition-all ${tool === 'eraser' ? 'bg-primary text-white' : 'hover:bg-primary/10'}`}
                >
                    <Eraser size={20} />
                </button>
                <div className="w-px h-6 bg-border mx-1" />
                <button
                    onClick={() => setTool("square")}
                    className={`p-2.5 rounded-xl transition-all ${tool === 'square' ? 'bg-primary text-white' : 'hover:bg-primary/10'}`}
                >
                    <Square size={20} />
                </button>
                <button
                    onClick={() => setTool("circle")}
                    className={`p-2.5 rounded-xl transition-all ${tool === 'circle' ? 'bg-primary text-white' : 'hover:bg-primary/10'}`}
                >
                    <Circle size={20} />
                </button>
                <button
                    onClick={() => {
                        setTool("pencil");
                        setStickies([...stickies, { id: Date.now(), x: 100, y: 100, text: "New Note" }]);
                    }}
                    className="p-2.5 hover:bg-amber-500/10 hover:text-amber-500 rounded-xl transition-all"
                >
                    <StickyIcon size={20} />
                </button>
                <div className="w-px h-6 bg-border mx-1" />
                <input
                    type="color"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    className="w-8 h-8 rounded-lg overflow-hidden cursor-pointer border-none bg-transparent"
                />
                <select
                    value={lineWidth}
                    onChange={(e) => setLineWidth(parseInt(e.target.value))}
                    className="bg-transparent text-sm font-bold p-1 outline-none"
                >
                    <option value="2">Thin</option>
                    <option value="5">Medium</option>
                    <option value="10">Thick</option>
                </select>
                <div className="w-px h-6 bg-border mx-1" />
                <button onClick={clearBoard} className="p-2.5 hover:bg-red-500/10 hover:text-red-500 rounded-xl transition-all">
                    <RotateCcw size={20} />
                </button>
                <button onClick={downloadImage} className="p-2.5 hover:bg-primary/10 hover:text-primary rounded-xl transition-all">
                    <Download size={20} />
                </button>
            </div>

            <div className="w-full h-full bg-white dark:bg-zinc-900 border rounded-[2.5rem] shadow-inner relative overflow-hidden">
                <canvas
                    ref={canvasRef}
                    onMouseDown={startDrawing}
                    onMouseMove={draw}
                    onMouseUp={stopDrawing}
                    onMouseLeave={stopDrawing}
                    onTouchStart={startDrawing}
                    onTouchMove={draw}
                    onTouchEnd={stopDrawing}
                    className={`w-full h-full ${tool === 'pencil' ? 'cursor-crosshair' : 'cursor-default'}`}
                />

                {stickies.map(sticky => (
                    <div
                        key={sticky.id}
                        className="absolute p-4 shadow-2xl rounded-xl bg-amber-200 text-amber-900 font-bold min-w-[150px] cursor-move flex flex-col group/sticky"
                        style={{ left: sticky.x, top: sticky.y }}
                    >
                        <textarea
                            className="bg-transparent border-none outline-none resize-none overflow-hidden text-sm"
                            defaultValue={sticky.text}
                            rows={3}
                        />
                        <button
                            onClick={() => setStickies(stickies.filter(s => s.id !== sticky.id))}
                            className="absolute -top-2 -right-2 w-6 h-6 bg-rose-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover/sticky:opacity-100 transition-opacity"
                        >
                            <X size={12} />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};
