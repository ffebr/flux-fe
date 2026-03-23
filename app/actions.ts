'use server';

import { apiClient } from '@/lib/api';
import { redirect } from 'next/navigation';

export async function createBoard(prevState: any, formData: FormData) {
    const question = formData.get('question') as string;
    const ttl = parseInt(formData.get('ttl') as string, 10);

    if (!question || isNaN(ttl)) {
        return { error: 'Invalid input provided' };
    }

    const { data, error } = await apiClient.POST('/boards', {
        body: {
            question,
            ttl,
        },
    });

    if (error || !data) {
        const errorMsg = typeof error === 'object' && error !== null && 'message' in error
            ? String(error.message)
            : 'Failed to create board. Please try again later.';
        return { error: errorMsg };
    }

    // Redirect to the new board
    redirect(`/board/${data.id}`);
}
