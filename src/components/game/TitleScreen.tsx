import { Sparkles, Play } from "lucide-react";
import { Elephant } from "./Elephant";
import { Fireflies, StarField } from "./Particles";
import { VillageBackdrop } from "./VillageBackdrop";

interface TitleScreenProps {
  onStart: () => void;
}

export function TitleScreen({ onStart }: TitleScreenProps) {
  return (
    <div className="relative h-full w-full overflow-hidden">
      <VillageBackdrop brightness={0.1} />
      <StarField count={90} />
      <Fireflies count={26} />

      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
        <div
          className="mb-2 flex items-center gap-2 text-[oklch(0.86_0.16_75)]"
          style={{ animation: "slide-up-fade 0.8s ease-out both" }}
        >
          <Sparkles className="h-5 w-5" />
          <span className="font-display text-sm uppercase tracking-[0.4em]">A magical adventure</span>
          <Sparkles className="h-5 w-5" />
        </div>

        <h1
          className="font-display text-5xl leading-none text-white sm:text-7xl md:text-8xl"
          style={{
            animation: "title-glow 3s ease-in-out infinite, slide-up-fade 0.9s ease-out both",
          }}
        >
          The Lost Light
        </h1>
        <h2 className="mt-2 font-display text-3xl text-[oklch(0.86_0.16_75)] sm:text-4xl md:text-5xl"
          style={{ animation: "slide-up-fade 1s ease-out 0.1s both" }}
        >
          of Diwali
        </h2>

        <p
          className="mt-6 max-w-md text-base text-white/85 md:text-lg"
          style={{ animation: "slide-up-fade 1.1s ease-out 0.2s both" }}
        >
          A sleepy village waits in the dark. Help a little elephant bring the
          festival of lights back to life.
        </p>

        {/* Hero elephant — dominates the screen, the emotional hook */}
        <div className="relative mt-6" style={{ animation: "slide-up-fade 1.2s ease-out 0.3s both" }}>
          <Elephant size={340} />
        </div>

        <button
          type="button"
          onClick={onStart}
          className="group mt-4 inline-flex items-center gap-3 rounded-full bg-gradient-to-r from-[oklch(0.86_0.18_70)] to-[oklch(0.78_0.2_45)] px-9 py-4 font-display text-lg font-bold text-[oklch(0.18_0.06_270)] shadow-[0_10px_40px_oklch(0.78_0.2_45/0.5)] transition-all hover:scale-105 hover:shadow-[0_14px_60px_oklch(0.86_0.18_70/0.7)] active:scale-95 md:text-xl"
          style={{ animation: "slide-up-fade 1.3s ease-out 0.4s both" }}
        >
          <Play className="h-5 w-5 fill-current" />
          Begin the Story
        </button>
      </div>
    </div>
  );
}
