import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { SearchX } from 'lucide-react';

export default function GlobalNotFound() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-cu-8 relative overflow-hidden">
      <div className="absolute inset-0 cu-blueprint pointer-events-none z-0" />
      
      <div className="relative z-10 max-w-xl text-center space-y-cu-8 animate-in fade-in duration-700">
        <div className="flex justify-center">
            <div className="w-20 h-20 border border-border rounded-full flex items-center justify-center bg-background/50 backdrop-blur-sm">
                <SearchX className="w-10 h-10 text-primary" />
            </div>
        </div>
        
        <div className="space-y-cu-4">
          <div className="inline-flex items-center border border-border bg-background/50 px-cu-4 py-cu-2 text-xs font-semibold uppercase tracking-widest text-foreground/70 rounded-lg">
            Статус // 404
          </div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-foreground leading-tight">
            Нет данны<span className="text-primary">х</span>
          </h1>
          <p className="text-lg text-foreground/70 font-medium">
            Доска, которую вы ищете, не существует.
          </p>
        </div>

        <div className="pt-cu-4">
          <Link href="/">
            <Button className="cu-button-primary h-14 px-cu-12 text-lg rounded-lg">
                Вернуться на главную
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
