import { CreateBoardForm } from '@/components/board/create-board-form';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-cu-8 md:p-cu-12 bg-background selection:bg-primary selection:text-primary-foreground overflow-hidden relative">
      {/* Blueprint Grid Layer */}
      <div className="absolute inset-0 cu-blueprint pointer-events-none z-0" />

      <div className="w-full max-w-3xl flex flex-col relative z-10 animate-in fade-in duration-700">
        <div className="mb-cu-16 space-y-cu-6 text-left border-b border-border pb-cu-12">
          <div className="inline-flex items-center border border-border bg-background/50 backdrop-blur-sm px-cu-4 py-cu-2 text-xs font-semibold uppercase tracking-widest text-foreground/70 rounded-lg">
            СОСТОЯНИЕ: ОНЛАЙН // ПРИЕМ ДАННЫХ
          </div>
          <h1 className="text-6xl sm:text-8xl font-bold tracking-tight text-foreground leading-[1.05]">
            Flu<span className="text-primary">x</span>
          </h1>
          <p className="text-xl md:text-2xl text-foreground/80 font-medium max-w-lg leading-snug">
            Профессиональные real-time доски. Мгновенный сбор инсайтов в чистой структурной эстетике.
          </p>
        </div>
        <div className="w-full mt-cu-12">
          <CreateBoardForm />
        </div>
      </div>
    </main>
  );
}
