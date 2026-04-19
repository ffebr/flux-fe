'use client';

import { useEffect, useMemo, useState } from 'react';
import { useBoardStore } from '@/store/board-store';
import { ShareDialog } from './share-dialog';
import { CountdownTimer } from './countdown-timer';
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
            const currentHost = window.location.host;
            Promise.resolve().then(() => setShareUrl(`${currentHost}/${initialBoard.id}`));
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
        <div className="w-full min-h-screen flex flex-col p-cu-8 md:p-cu-12 relative z-10 animate-in fade-in duration-700 bg-background overflow-hidden">
            {/* Subtle Blueprint Grid Layer */}
            <div className="absolute inset-0 cu-blueprint pointer-events-none -z-10" />

            <header className="cu-grid mb-16 shrink-0 relative z-10 items-end">
                <div>
                    <div className="text-sm font-semibold uppercase tracking-wider mb-cu-4 flex items-center gap-3 text-foreground/80">
                        <div className={`w-2.5 h-2.5 rounded-full ${isConnected ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]' : 'bg-red-500'}`}></div>
                        {isConnected ? 'ПРЯМОЙ ЭФИР' : 'ВНЕ СЕТИ'}
                    </div>
                    <h1 className="text-5xl md:text-7xl font-bold leading-[1.05] tracking-tight text-foreground max-w-4xl">
                        {activeBoard.question.slice(0, -1)}
                        <span className="text-primary">{activeBoard.question.slice(-1)}</span>
                    </h1>
                </div>
                <div className="flex flex-col items-start md:items-end gap-cu-2 md:text-right mt-cu-8 md:mt-0">
                    <div className="text-2xl font-semibold text-foreground">
                        {sortedWords.reduce((acc, curr) => acc + curr.count, 0)} <span className="text-foreground/60 font-medium">ОТВЕТОВ</span>
                    </div>
                    <div className="text-base font-medium text-foreground/60 flex items-center gap-2">
                        <Clock className="w-4 h-4" /> <span className="uppercase tracking-wide">ИСТ:</span> <CountdownTimer expiresAt={activeBoard.expiresAt} />
                    </div>
                    <div className="mt-cu-4 border border-border px-cu-4 py-cu-2 font-medium tracking-tight text-center inline-block bg-background/50 backdrop-blur-sm text-foreground rounded-lg">
                        {shareUrl}
                    </div>
                    <div className="mt-cu-2 shrink-0 pointer-events-auto">
                        <ShareDialog boardId={activeBoard.id} />
                    </div>
                </div>
            </header>

            <main className="flex-1 flex items-center justify-center relative w-full h-full pb-cu-20">
                {sortedWords.length === 0 ? (
                    <div className="py-cu-24 flex flex-col items-center justify-center text-center border border-border rounded-lg bg-background/40 backdrop-blur-sm p-cu-12 w-full max-w-4xl mx-auto">
                        <div className="w-16 h-16 border border-border rounded-full flex items-center justify-center mb-cu-6">
                            <Clock className="w-8 h-8 text-muted-foreground" />
                        </div>
                        <p className="text-3xl font-bold text-foreground mb-cu-3">Ожидание ввода</p>
                        <p className="text-muted-foreground font-medium tracking-wide max-w-sm">Поделитесь ссылкой, чтобы начать сбор данных.</p>
                    </div>
                ) : (
                    <div className="w-full max-w-[95%] mx-auto flex flex-wrap content-center items-center justify-center gap-cu-6" id="cloud">
                        {/* Centric Word Cloud layout */}
                        {centerWeightedWords.map(({ word, count }) => {
                            const weight = count / maxCount; // 0.0 to 1.0

                            // Map weight to font scale: 2rem to 9rem for cleaner emphasis
                            const minSize = 2;
                            const maxSize = 9;
                            const fontSize = `${minSize + (weight * (maxSize - minSize))}rem`;

                            const opacity = Math.max(0.4, weight + 0.3);
                            const zIndex = 100 - sortedWords.findIndex(w => w.word === word);

                            return (
                                <div
                                    key={word}
                                    className="word-item font-bold tracking-tight leading-[0.9] text-foreground cursor-default select-none transition-all duration-300 hover:scale-[1.08] hover:text-primary relative group"
                                    style={{ fontSize, opacity, zIndex }}
                                >
                                    {word}
                                    {/* Refined count overlay */}
                                    <span className="absolute -top-cu-2 -right-cu-2 bg-primary text-primary-foreground text-[10px] font-semibold px-1.5 py-0.5 rounded-sm opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity">
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
