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
        <div className="w-full bg-background/80 backdrop-blur-md border border-border p-cu-8 md:p-cu-10 rounded-lg relative overflow-hidden animate-in fade-in duration-700">
            {/* Blueprint Grid Layer */}
            <div className="absolute inset-0 cu-blueprint pointer-events-none -z-10" />

            <div className="mb-cu-10 text-left">
                <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground leading-none">
                    Инициализаци<span className="text-primary">я</span>
                </h2>
            </div>
            <form action={formAction} className="space-y-cu-8">
                <div className="space-y-cu-4 relative">
                    <Label htmlFor="question" className="text-base font-semibold tracking-wide text-foreground/80 block uppercase">Текст вопроса</Label>
                    <Input
                        id="question"
                        name="question"
                        placeholder="Введите ваш вопрос"
                        className="cu-input text-xl h-14 w-full"
                        required
                        disabled={isPending}
                    />
                </div>
                <div className="space-y-cu-4 relative">
                    <Label htmlFor="ttl" className="text-base font-semibold tracking-wide text-foreground/80 block uppercase">Время жизни (сек)</Label>
                    <Input
                        id="ttl"
                        name="ttl"
                        type="number"
                        defaultValue={3600}
                        className="cu-input text-xl h-14 w-full"
                        required
                        disabled={isPending}
                    />
                </div>
                {state?.error && (
                    <div className="border border-destructive/50 bg-destructive/5 p-cu-4 rounded-lg">
                        <p className="text-base font-semibold text-destructive">
                            ОШИБКА: {state.error}
                        </p>
                    </div>
                )}

                <div className="pt-cu-6">
                    <Button type="submit" size="lg" className="cu-button-primary w-full h-16 text-xl rounded-lg" disabled={isPending}>
                        {isPending ? (
                            <>
                                <Loader2 className="mr-3 h-6 w-6 animate-spin" />
                                Обработка...
                            </>
                        ) : (
                            'Запустить сессию'
                        )}
                    </Button>
                </div>
            </form>
        </div>
    );
}
