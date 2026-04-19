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
        <div className="w-full max-w-2xl mx-auto bg-background/80 backdrop-blur-md border border-border p-cu-8 md:p-cu-12 rounded-lg relative overflow-hidden animate-in fade-in duration-700">
            {/* Blueprint Grid Layer */}
            <div className="absolute inset-0 cu-blueprint pointer-events-none -z-10" />

            <div className="mb-cu-12 border-b border-border pb-cu-8">
                <div className="text-primary tracking-widest text-xs font-semibold mb-cu-4 uppercase">
                    Активный запрос // Ожидание ввода
                </div>
                <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-foreground leading-[1.1]">
                    {question.slice(0, -1)}
                    <span className="text-primary">{question.slice(-1)}</span>
                </h1>
            </div>

            <form ref={formRef} action={formAction} className="space-y-cu-8">
                <div className="space-y-cu-4">
                    <Input
                        id="word"
                        name="word"
                        placeholder="Введите краткий ответ"
                        autoComplete="off"
                        className="cu-input text-2xl h-16 w-full text-center"
                        required
                        disabled={isPending}
                        autoFocus
                    />
                </div>

                {state?.error && (
                    <div className="border border-destructive/50 bg-destructive/5 p-cu-4 rounded-lg">
                        <p className="text-base font-semibold text-destructive">
                            ОШИБКА: {state.error}
                        </p>
                    </div>
                )}

                {state?.success && (
                    <div className="border border-primary/50 bg-primary/5 p-cu-4 text-center text-primary font-semibold rounded-lg">
                        ОТВЕТ ПРИНЯТ. ЕЩЕ РАЗ?
                    </div>
                )}

                <div className="pt-cu-8">
                    <Button type="submit" size="lg" className="cu-button-primary text-xl h-16 w-full rounded-lg" disabled={isPending}>
                        {isPending ? (
                            <>
                                <Loader2 className="mr-3 h-6 w-6 animate-spin" />
                                Передача...
                            </>
                        ) : (
                            'Отправить ответ'
                        )}
                    </Button>
                </div>
            </form>
        </div>
    );
}
