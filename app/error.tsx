'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('[GlobalError]', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-cu-8 relative overflow-hidden">
      <div className="absolute inset-0 cu-blueprint pointer-events-none z-0" />
      
      <div className="relative z-10 max-w-xl text-center space-y-cu-8 animate-in fade-in duration-700">
        <div className="space-y-cu-4">
          <div className="inline-flex items-center border border-destructive/30 bg-destructive/5 px-cu-4 py-cu-2 text-xs font-semibold uppercase tracking-widest text-destructive rounded-lg">
            Критический сбой // Система
          </div>
          <h1 className="text-6xl md:text-8xl font-bold tracking-tight text-foreground leading-none">
            Ошибк<span className="text-primary">а</span>
          </h1>
          <p className="text-xl text-foreground/70 font-medium">
            Произошла критическая ошибка приложения. Мы работаем над восстановлением системы.
          </p>
        </div>

        <div className="pt-cu-4 flex flex-col sm:flex-row gap-cu-4 justify-center">
          <Button onClick={reset} className="cu-button-primary h-14 px-cu-8 text-lg rounded-lg">
            Перезапустить
          </Button>
          <Button 
            variant="outline" 
            onClick={() => window.location.href = '/'}
            className="h-14 px-cu-8 text-lg rounded-lg border-border font-medium"
          >
            На главную
          </Button>
        </div>
        
        {error.digest && (
          <p className="text-xs font-mono text-muted-foreground pt-cu-8">
            Reference ID: {error.digest}
          </p>
        )}
      </div>
    </div>
  );
}
