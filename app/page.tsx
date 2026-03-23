import { CreateBoardForm } from '@/components/board/create-board-form';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 md:p-12 selection:bg-foreground selection:text-background overflow-hidden relative">
      <div className="w-full max-w-3xl flex flex-col relative z-10 animate-in fade-in duration-500">
        <div className="mb-16 space-y-6 text-left border-b-[6px] border-foreground pb-12">
          <div className="inline-flex items-center border-[3px] border-foreground bg-background px-4 py-2 text-sm font-bold uppercase tracking-widest text-foreground">
            System Online // Live Input
          </div>
          <h1 className="text-6xl sm:text-8xl font-black tracking-tighter text-foreground uppercase leading-none">
            Flux
            <br />
            Boards.
          </h1>
          <p className="text-2xl text-foreground font-medium max-w-lg leading-snug">
            Create uncompromising, real-time boards. Gather insights instantly with zero visual clutter.
          </p>
        </div>
        <div className="w-full mt-12">
          <CreateBoardForm />
        </div>
      </div>
    </main>
  );
}
