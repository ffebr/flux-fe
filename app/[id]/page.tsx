import { RespondForm } from '@/components/board/respond-form';
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

    if (!board) return { title: 'Respond | Not Found' };

    return {
        title: `Respond to: ${board.question}`,
    };
}

export default async function RespondPage({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = await params;
    const boardId = resolvedParams.id;

    const { data: board, error } = await apiClient.GET('/boards/{id}', {
        params: {
            path: { id: boardId },
        },
        cache: 'no-store', // Board could expire at any time
    });

    if (error || !board) {
        notFound();
    }

    return (
        <main className="min-h-screen bg-background text-foreground p-cu-8 md:p-cu-12 flex flex-col items-center justify-center font-sans selection:bg-primary selection:text-primary-foreground overflow-hidden relative">
            {/* Blueprint Grid Layer */}
            <div className="absolute inset-0 cu-blueprint pointer-events-none z-0" />

            <div className="w-full max-w-4xl relative z-10 animate-in fade-in duration-700">
                <RespondForm boardId={board.id} question={board.question} />
            </div>
        </main>
    );
}
