import { create } from 'zustand';
import type { components } from '@/lib/api/schema';

type BoardResponse = components['schemas']['BoardResponse'];
type BoardEvent = components['schemas']['BoardEvent'];
type WordAddedEvent = components['schemas']['WordAddedEvent'];

interface BoardState {
    board: BoardResponse | null;
    isConnected: boolean;
    error: string | null;
    eventSource: EventSource | null;

    // Actions
    initBoard: (board: BoardResponse) => void;
    connectSSE: (boardId: string) => void;
    disconnectSSE: () => void;
    setError: (error: string | null) => void;
}

export const useBoardStore = create<BoardState>((set, get) => ({
    board: null,
    isConnected: false,
    error: null,
    eventSource: null,

    initBoard: (board) => set({ board, error: null }),

    connectSSE: (boardId) => {
        const currentState = get();
        if (currentState.eventSource) {
            currentState.eventSource.close();
        }

        const apiUrl = typeof window !== 'undefined' ? '/api' : (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080');
        const url = `${apiUrl}/boards/${boardId}/events`;
        console.log(`[SSE INIT] Attempting to connect to EventSource at: ${url}`);

        const eventSource = new EventSource(url, { withCredentials: false });

        eventSource.onopen = () => {
            console.log(`[SSE OPEN] Connection established successfully to ${url}. ReadyState: ${eventSource.readyState}`);
            set({ isConnected: true, error: null });
        };

        const handleMessage = (type: string, eventData: string) => {
            console.log(`[SSE MESSAGE] Received Event [type=${type}] [readyState=${eventSource.readyState}] payload:`, eventData);
            try {
                const data = JSON.parse(eventData);
                const actualType = data.eventType || type;

                // If the backend sent a full board object instead of a delta diff, we can just sync it
                if (data.id && data.question && data.words) {
                    console.log('[SSE] Received full board object, syncing state completely.');
                    set({ board: data });
                    return;
                }

                if (actualType === 'word-added' || data.WordAdded || data.word || data.value) {
                    set((state) => {
                        if (!state.board) return state;

                        const currentWords = state.board.words || {};
                        // Handle both internal structure and externally tagged Server Enums e.g {"WordAdded": {"word": {"value": ...}}}
                        const wordData = data.WordAdded || data;
                        const wordValue = typeof wordData.word === 'string' ? wordData.word : (wordData.word?.value || wordData.value);

                        if (!wordValue) {
                            console.warn('[SSE] Could not resolve word value from:', data);
                            return state;
                        }

                        const newCount = (currentWords[wordValue] || 0) + 1;
                        console.log(`[SSE] Updating word '${wordValue}' to count ${newCount}`);

                        return {
                            board: {
                                ...state.board,
                                words: {
                                    ...currentWords,
                                    [wordValue]: newCount,
                                },
                            },
                        };
                    });
                }
            } catch (err) {
                console.error('[SSE] Failed to parse event', err, eventData);
            }
        };

        eventSource.onmessage = (event) => handleMessage('message', event.data);
        eventSource.addEventListener('word-added', (event) => handleMessage('word-added', (event as MessageEvent).data));
        eventSource.addEventListener('board-created', (event) => handleMessage('board-created', (event as MessageEvent).data));

        eventSource.onerror = (error) => {
            console.error('[SSE] Connection Error:', error);
            if (eventSource.readyState === EventSource.CLOSED) {
                set({ isConnected: false, error: 'Connection closed. Trying to reconnect...' });
            }
        };

        set({ eventSource });
    },

    disconnectSSE: () => {
        const { eventSource } = get();
        if (eventSource) {
            eventSource.close();
            set({ eventSource: null, isConnected: false });
        }
    },

    setError: (error) => set({ error }),
}));
