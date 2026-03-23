'use client';

import { useActionState, useEffect, useRef } from 'react';
import { submitWord } from '@/app/[id]/actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export function RespondForm({ boardId, question }: { boardId: string; question: string }) {
    const submitAction = submitWord.bind(null, boardId);
    const [state, formAction, isPending] = useActionState(submitAction, null);
    const formRef = useRef<HTMLFormElement>(null);

    useEffect(() => {
        if (state?.success) {
            toast.success('DATA RECEIVED. OK.');
            if (formRef.current) {
                formRef.current.reset();
            }
        }
    }, [state]);

    return (
        <div className="w-full max-w-2xl mx-auto bg-background border-[6px] border-foreground p-8 md:p-12 animate-in fade-in duration-500">
            <div className="mb-12 border-b-[4px] border-foreground pb-8">
                <div className="text-primary uppercase tracking-widest text-sm font-black mb-4">
                    Active Query // Input Required
                </div>
                <h1 className="text-4xl sm:text-6xl font-black tracking-tighter text-foreground leading-none uppercase">
                    {question}
                </h1>
            </div>

            <form ref={formRef} action={formAction} className="space-y-8">
                <div className="space-y-4">
                    <Input
                        id="word"
                        name="word"
                        placeholder="ENTER SINGLE WORD..."
                        autoComplete="off"
                        className="swiss-input text-2xl h-20 w-full text-center uppercase"
                        required
                        disabled={isPending}
                        autoFocus
                    />
                </div>

                {state?.error && (
                    <div className="border-[3px] border-destructive bg-background p-4 mt-8">
                        <p className="text-lg font-bold uppercase tracking-widest text-destructive">
                            ERROR: {state.error}
                        </p>
                    </div>
                )}

                {state?.success && (
                    <div className="border-[3px] border-primary bg-background p-4 mt-8 text-center text-primary font-bold uppercase tracking-widest">
                        PAYLOAD ACCEPTED. REPEAT?
                    </div>
                )}

                <div className="pt-8">
                    <Button type="submit" size="lg" className="swiss-button text-2xl h-24 w-full" disabled={isPending}>
                        {isPending ? (
                            <>
                                <Loader2 className="mr-4 h-8 w-8 animate-spin" />
                                TRANSMITTING...
                            </>
                        ) : (
                            'SUBMIT DATA >'
                        )}
                    </Button>
                </div>
            </form>
        </div>
    );
}
