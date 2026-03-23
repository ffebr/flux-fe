'use client';

import { useState, useEffect } from 'react';

export function CountdownTimer({ expiresAt }: { expiresAt: string }) {
    const [timeLeft, setTimeLeft] = useState(() => {
        return Math.max(0, new Date(expiresAt).getTime() - Date.now());
    });

    // Prevent hydration mismatch by only rendering the live time on the client
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const interval = setInterval(() => {
            const remaining = Math.max(0, new Date(expiresAt).getTime() - Date.now());
            setTimeLeft(remaining);
            if (remaining <= 0) {
                clearInterval(interval);
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [expiresAt]);

    if (!mounted) {
        // Fallback or placeholder during SSR/Hydration matching the static look
        return <span className="tabular-nums">--:--</span>;
    }

    if (timeLeft <= 0) {
        return <span className="text-red-500 animate-pulse uppercase font-black">EXPIRED</span>;
    }

    const hours = Math.floor(timeLeft / (1000 * 60 * 60));
    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

    const pad = (num: number) => num.toString().padStart(2, '0');

    return (
        <span className="tabular-nums tracking-tight">
            {hours > 0 ? `${pad(hours)}:` : ''}{pad(minutes)}:{pad(seconds)}
        </span>
    );
}
