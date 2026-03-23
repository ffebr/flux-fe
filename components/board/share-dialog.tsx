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
            setRespondUrl(`${window.location.origin}/${boardId}`);
        }
    }, [boardId]);

    const onCopy = () => {
        navigator.clipboard.writeText(respondUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <Dialog>
            <DialogTrigger render={<Button variant="outline" className="gap-2 rounded-full font-medium" />}>
                <Share2 className="h-4 w-4" />
                Share Board
            </DialogTrigger>
            <DialogContent className="sm:max-w-md rounded-2xl">
                <DialogHeader>
                    <DialogTitle>Share Board</DialogTitle>
                    <DialogDescription>
                        Share this link or QR code to let others submit responses.
                    </DialogDescription>
                </DialogHeader>
                <div className="flex flex-col items-center justify-center space-y-6 py-6">
                    <div className="p-6 bg-white rounded-2xl shadow-sm border border-zinc-200">
                        {respondUrl && <QRCodeSVG value={respondUrl} size={220} />}
                    </div>
                    <div className="flex w-full max-w-sm items-center space-x-2">
                        <Input value={respondUrl} readOnly className="flex-1 text-sm bg-zinc-50 dark:bg-zinc-900" />
                        <Button size="icon" onClick={onCopy} variant="secondary" className="shrink-0">
                            {copied ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
