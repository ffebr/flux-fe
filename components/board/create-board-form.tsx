'use client';

import { useActionState } from 'react';
import { createBoard } from '@/app/actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';

export function CreateBoardForm() {
    const [state, formAction, isPending] = useActionState(createBoard, null);

    return (
        <div className="w-full bg-background border-[6px] border-foreground p-8 md:p-10 relative">
            <div className="mb-10 text-left">
                <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-foreground leading-none">Initialize</h2>
            </div>
            <form action={formAction} className="space-y-8">
                <div className="space-y-4 relative">
                    <Label htmlFor="question" className="text-xl font-bold uppercase tracking-widest text-foreground block">Query String</Label>
                    <Input
                        id="question"
                        name="question"
                        placeholder="ENTER QUESTION HERE..."
                        className="swiss-input text-2xl h-16 w-full"
                        required
                        disabled={isPending}
                    />
                </div>
                <div className="space-y-4 relative">
                    <Label htmlFor="ttl" className="text-xl font-bold uppercase tracking-widest text-foreground block">Session TTL (Seconds)</Label>
                    <Input
                        id="ttl"
                        name="ttl"
                        type="number"
                        defaultValue={3600}
                        className="swiss-input text-2xl h-16 w-full"
                        required
                        disabled={isPending}
                    />
                </div>
                {state?.error && (
                    <div className="border-[3px] border-destructive bg-background p-4 mt-8">
                        <p className="text-lg font-bold uppercase tracking-widest text-destructive">
                            ERROR_THROWN: {state.error}
                        </p>
                    </div>
                )}

                <div className="pt-6">
                    <Button type="submit" size="lg" className="swiss-button-primary w-full h-20 text-2xl" disabled={isPending}>
                        {isPending ? (
                            <>
                                <Loader2 className="mr-4 h-8 w-8 animate-spin" />
                                PROCESSING...
                            </>
                        ) : (
                            'EXECUTE COMMAND >'
                        )}
                    </Button>
                </div>
            </form>
        </div>
    );
}
