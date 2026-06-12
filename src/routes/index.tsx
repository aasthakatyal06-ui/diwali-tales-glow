import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useState } from "react";
import { TitleScreen } from "@/components/game/TitleScreen";
import { LevelStage } from "@/components/game/LevelStage";
import { FinaleScene } from "@/components/game/FinaleScene";
import { LEVELS } from "@/game/levels";
import { unlockAudio } from "@/game/audio";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Chakra-Bots: The Lost Light of Diwali" },
      {
        name: "description",
        content:
          "A magical animated storybook — help a little elephant bring the lights of Diwali back to a sleepy Indian village.",
      },
      { property: "og:title", content: "Chakra-Bots: The Lost Light of Diwali" },
      {
        property: "og:description",
        content: "Help a little elephant restore the festival of lights.",
      },
    ],
  }),
  component: GamePage,
});

type Screen = { kind: "title" } | { kind: "level"; index: number } | { kind: "finale" };

function GamePage() {
  const [screen, setScreen] = useState<Screen>({ kind: "title" });

  const startGame = useCallback(() => {
    unlockAudio();
    setScreen({ kind: "level", index: 0 });
  }, []);

  const advance = useCallback(() => {
    setScreen((s) => {
      if (s.kind !== "level") return s;
      const next = s.index + 1;
      return next >= LEVELS.length ? { kind: "finale" } : { kind: "level", index: next };
    });
  }, []);

  const replay = useCallback(() => setScreen({ kind: "title" }), []);

  return (
    <main className="fixed inset-0 bg-[oklch(0.1_0.05_270)]">
      {screen.kind === "title" && <TitleScreen onStart={startGame} />}
      {screen.kind === "level" && (
        <LevelStage
          key={screen.index}
          level={LEVELS[screen.index]}
          onComplete={advance}
        />
      )}
      {screen.kind === "finale" && <FinaleScene onReplay={replay} />}
    </main>
  );
}
