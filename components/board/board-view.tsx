'use client';

import { useEffect, useMemo, useState } from 'react';
import { useBoardStore } from '@/store/board-store';
import { ShareDialog } from './share-dialog';
import { CountdownTimer } from './countdown-timer';
import { Card, CardContent } from '@/components/ui/card';
import { Clock } from 'lucide-react';
import { toast } from 'sonner';
import type { components } from '@/lib/api/schema';

type BoardResponse = components['schemas']['BoardResponse'];

export function BoardView({ initialBoard }: { initialBoard: BoardResponse }) {
    const { board, isConnected, error, initBoard, connectSSE, disconnectSSE } = useBoardStore();

    useEffect(() => {
        initBoard(initialBoard);
        connectSSE(initialBoard.id);

        return () => {
            disconnectSSE();
        };
    }, [initialBoard, initBoard, connectSSE, disconnectSSE]);

    const [shareUrl, setShareUrl] = useState(`.../${initialBoard.id}`);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            setShareUrl(`${window.location.host}/${initialBoard.id}`);
        }
    }, [initialBoard.id]);

    useEffect(() => {
        if (error) {
            toast.error(error);
        }
    }, [error]);

    const activeBoard = board || initialBoard;

    const sortedWords = useMemo(() => {
        const wordsObj = activeBoard.words || {};
        return Object.entries(wordsObj)
            .map(([word, count]) => ({ word, count }))
            .sort((a, b) => b.count - a.count);
    }, [activeBoard.words]);

    // Distribute words in a spiraling pattern to form a cohesive "pile" or "cluster".
    // We achieve this by sorting words such that the largest are central, and then surrounding 
    // them alternately on left/right and attempting to break lines naturally via flex constraints.
    const centerWeightedWords = useMemo(() => {
        if (!sortedWords.length) return [];

        const result: typeof sortedWords = [];
        // Pattern to build a cluster: [..., 4, 2, 0(center), 1, 3, 5, ...]
        // By controlling how flex-wrap breaks, we get a clustered effect.
        sortedWords.forEach((item, index) => {
            if (index % 2 === 0) {
                result.push(item);
            } else {
                result.unshift(item);
            }
        });
        return result;
    }, [sortedWords]);

    const maxCount = sortedWords[0]?.count || 1;

    // Additional layout trick: wrapping the word cluster in a constrained-width container
    // forces flex-wrap to stack items vertically into a blob rather than a straight line.
    return (
        <div className="w-full min-h-screen flex flex-col p-8 md:p-12 relative z-10 animate-in fade-in duration-500 bg-background">
            <header className="swiss-grid mb-16 shrink-0 relative z-10 items-end">
                <div>
                    <div className="text-sm font-bold uppercase tracking-widest mb-4 flex items-center gap-3 text-foreground">
                        <div className={`w-3 h-3 rounded-none ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
                        {isConnected ? 'LIVE SESSION' : 'OFFLINE'}
                    </div>
                    <h1 className="text-5xl md:text-7xl font-black leading-none tracking-tighter uppercase text-foreground max-w-4xl">
                        {activeBoard.question}
                    </h1>
                </div>
                <div className="flex flex-col items-start md:items-end gap-2 md:text-right mt-8 md:mt-0">
                    <div className="text-2xl font-bold uppercase text-foreground">
                        {sortedWords.reduce((acc, curr) => acc + curr.count, 0)} RESPONSES
                    </div>
                    <div className="text-lg font-bold uppercase text-foreground/60 flex items-center gap-2">
                        <Clock className="w-5 h-5" /> EXP: <CountdownTimer expiresAt={activeBoard.expiresAt} />
                    </div>
                    <div className="mt-4 border-[3px] border-foreground p-4 font-bold tracking-widest text-center inline-block bg-background text-foreground">
                        {shareUrl}
                    </div>
                    <div className="mt-2 shrink-0 pointer-events-auto">
                        <ShareDialog boardId={activeBoard.id} />
                    </div>
                </div>
            </header>

            <main className="flex-1 flex items-center justify-center relative w-full h-full pb-20">
                {sortedWords.length === 0 ? (
                    <div className="py-24 flex flex-col items-center justify-center text-center border-[4px] border-foreground p-12 w-full max-w-4xl mx-auto">
                        <div className="w-20 h-20 border-[4px] border-foreground flex items-center justify-center mb-6 animate-pulse">
                            <Clock className="w-10 h-10 text-foreground" />
                        </div>
                        <p className="text-3xl font-black uppercase text-foreground mb-3 tracking-tighter">WAITING FOR INPUT...</p>
                        <p className="text-foreground/70 font-bold uppercase tracking-widest max-w-sm">DISTRUBUTE THE SHARE LINK TO PROCEED.</p>
                    </div>
                ) : (
                    <div className="w-full max-w-[95%] mx-auto flex flex-wrap content-center items-center justify-center gap-6" id="cloud">
                        {/* Centric Word Cloud layout */}
                        {centerWeightedWords.map(({ word, count }) => {
                            const weight = count / maxCount; // 0.0 to 1.0

                            // Map weight to font scale: 2rem to 11rem for extreme center emphasis
                            const minSize = 2;
                            const maxSize = 11;
                            const fontSize = `${minSize + (weight * (maxSize - minSize))}rem`;

                            const opacity = Math.max(0.4, weight + 0.3);
                            const zIndex = 100 - sortedWords.findIndex(w => w.word === word);

                            return (
                                <div
                                    key={word}
                                    className="word-item font-black tracking-tighter leading-[0.85] text-foreground cursor-default select-none transition-transform duration-200 hover:scale-[1.05] hover:-rotate-1 hover:text-primary relative group"
                                    style={{ fontSize, opacity, zIndex }}
                                >
                                    {word}
                                    {/* Barebones count overlay */}
                                    <span className="absolute -top-4 -right-4 bg-primary text-primary-foreground text-xs font-bold px-2 py-1 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity">
                                        {count}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                )}
            </main>
        </div>
    );
}
