'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { WifiOff } from 'lucide-react';

export default function BoardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('[BoardError]', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-cu-8 relative overflow-hidden">
      <div className="absolute inset-0 cu-blueprint pointer-events-none z-0" />
      
      <div className="relative z-10 max-w-xl text-center space-y-cu-8 animate-in fade-in duration-700">
        <div className="flex justify-center">
            <div className="w-20 h-20 border border-border rounded-full flex items-center justify-center bg-background/50 backdrop-blur-sm">
                <WifiOff className="w-10 h-10 text-primary" />
            </div>
        </div>
        
        <div className="space-y-cu-4">
          <div className="inline-flex items-center border border-border bg-background/50 px-cu-4 py-cu-2 text-xs font-semibold uppercase tracking-widest text-foreground/70 rounded-lg">
            Связь // Ошибка
          </div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-foreground leading-tight">
            Вне сет<span className="text-primary">и</span>
          </h1>
          <p className="text-lg text-foreground/70 font-medium">
            Не удалось подключиться к серверу доски. Пожалуйста, проверьте интернет-соединение или попробуйте позже.
          </p>
        </div>

        <div className="pt-cu-4 flex flex-col sm:flex-row gap-cu-4 justify-center">
          <Button onClick={reset} className="cu-button-primary h-14 px-cu-8 text-lg rounded-lg">
            Повторить попытку
          </Button>
          <Button 
            variant="outline" 
            onClick={() => window.location.href = '/'}
            className="h-14 px-cu-8 text-lg rounded-lg border-border font-medium"
          >
            На базу
          </Button>
        </div>
      </div>
    </div>
  );
}
