'use server';

import { apiClient } from '@/lib/api';
import { revalidatePath } from 'next/cache';

export type SubmitState = { error?: string; success?: boolean } | null;

export async function submitWord(boardId: string, prevState: SubmitState, formData: FormData) {
    const word = formData.get('word') as string;

    if (!word || word.trim().length === 0) {
        return { error: 'Please enter a valid word or response.' };
    }

    let responseData;
    try {
        responseData = await apiClient.PATCH('/boards/{id}/words', {
            params: {
                path: { id: boardId },
            },
            body: {
                word: word.trim(),
            },
        });
    } catch (err) {
        console.error('[submitWord] Network Error:', err);
        return { error: 'Ошибка сети. Не удалось отправить ответ.' };
    }

    const { error, response } = responseData;

    // Handle expected errors based on the openapi schema responses (e.g. 409 Conflict for expired board)
    if (response.status === 409) {
        return { error: 'This board has expired and is no longer accepting responses.' };
    }

    if (error || response.status !== 202) {
        const errorMsg = typeof error === 'object' && error !== null && 'message' in error
            ? String(error.message)
            : 'Failed to submit response. The board might be missing or expired.';
        return { error: errorMsg };
    }

    // Trigger cache revalidation if necessary
    revalidatePath(`/board/${boardId}`);

    return { success: true };
}
