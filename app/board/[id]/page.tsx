import { BoardView } from '@/components/board/board-view';
import { apiClient } from '@/lib/api';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
    const resolvedParams = await params;
    const { data: board } = await apiClient.GET('/boards/{id}', {
        params: {
            path: { id: resolvedParams.id },
        },
    });

    if (!board) return { title: 'Board Not Found' };

    return {
        title: `${board.question} - Flux Boards`,
        description: 'Participate and view real-time responses.',
    };
}

export default async function BoardPage({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = await params;
    const boardId = resolvedParams.id;

    const { data: board, error } = await apiClient.GET('/boards/{id}', {
        params: {
            path: { id: boardId },
        },
        cache: 'no-store',
    });

    if (error || !board) {
        notFound();
    }

    return (
        <main className="min-h-screen font-sans selection:bg-foreground selection:text-background flex flex-col items-center justify-center p-0 m-0 bg-background text-foreground">
            <BoardView initialBoard={board} />
        </main>
    );
}
