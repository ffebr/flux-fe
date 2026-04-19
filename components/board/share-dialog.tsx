'use client';

import { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Copy, Share2, Check } from 'lucide-react';
import { Input } from '@/components/ui/input';

export function ShareDialog({ boardId }: { boardId: string }) {
    const [copied, setCopied] = useState(false);
    const [respondUrl, setRespondUrl] = useState('');

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const origin = window.location.origin;
            Promise.resolve().then(() => setRespondUrl(`${origin}/${boardId}`));
        }
    }, [boardId]);

    const onCopy = () => {
        navigator.clipboard.writeText(respondUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <Dialog>
            <DialogTrigger render={<Button variant="outline" className="gap-2 rounded-lg font-medium border-border hover:bg-accent/50 transition-colors" />}>
                <Share2 className="h-4 w-4" />
                Поделиться
            </DialogTrigger>
            <DialogContent className="sm:max-w-md rounded-lg border-border bg-background/95 backdrop-blur-md">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold tracking-tight">Поделиться</DialogTitle>
                    <DialogDescription className="text-muted-foreground">
                        Поделитесь ссылкой или QR-кодом для сбора ответов.
                    </DialogDescription>
                </DialogHeader>
                <div className="flex flex-col items-center justify-center space-y-cu-6 py-cu-6">
                    <div className="p-cu-6 bg-white rounded-lg border border-border/50">
                        {respondUrl && <QRCodeSVG value={respondUrl} size={220} fgColor="#141414" />}
                    </div>
                    <div className="flex w-full max-w-sm items-center space-x-cu-2">
                        <Input value={respondUrl} readOnly className="flex-1 text-sm bg-secondary/50 border-border rounded-lg" />
                        <Button size="icon" onClick={onCopy} variant="secondary" className="shrink-0 rounded-lg hover:bg-primary hover:text-primary-foreground transition-all">
                            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
