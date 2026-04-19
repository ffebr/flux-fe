'use server';

import { apiClient } from '@/lib/api';
import { redirect } from 'next/navigation';

export type CreateState = { error?: string } | null;

export async function createBoard(prevState: CreateState, formData: FormData) {
    const question = formData.get('question') as string;
    const ttl = parseInt(formData.get('ttl') as string, 10);

    if (!question || isNaN(ttl)) {
        return { error: 'Invalid input provided' };
    }

    let responseData;
    try {
        responseData = await apiClient.POST('/boards', {
            body: {
                question,
                ttl,
            },
        });
    } catch (err) {
        console.error('[createBoard] Network Error:', err);
        return { error: 'Не удалось соединиться с сервером. Проверьте подключение.' };
    }

    const { data, error } = responseData;

    if (error || !data) {
        const errorMsg = typeof error === 'object' && error !== null && 'message' in error
            ? String(error.message)
            : 'Failed to create board. Please try again later.';
        return { error: errorMsg };
    }

    // Redirect to the new board
    redirect(`/board/${data.id}`);
}
