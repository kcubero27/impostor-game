import { useMemo } from "react";
import { Game } from "@/domain/game/game.aggregate";
import { GamePlayer } from "@/domain/game/game-player.entity";
import { useTranslation } from "@/i18n";
import { Button } from "@/components/ui/button";

type GameStartProps = {
  game: Game;
  onRestartGame: () => void;
  onBackToSetup: () => void;
};

export const GameStart = ({
  game,
  onRestartGame,
  onBackToSetup,
}: GameStartProps) => {
  const { t } = useTranslation();

  // Compute starting player deterministically based on game properties
  // This avoids calling Math.random() during render and setState in effects
  const startingPlayer = useMemo<GamePlayer | null>(() => {
    const players = game.getPlayers();
    if (players.length === 0) return null;

    // Use a deterministic "random" selection based on player IDs
    // This creates a consistent selection per game without using Math.random()
    const playerIds = players.map((p) => p.getId()).sort();
    const hash = playerIds
      .join("")
      .split("")
      .reduce((acc, char) => {
        return ((acc << 5) - acc + char.charCodeAt(0)) | 0;
      }, 0);
    const index = Math.abs(hash) % players.length;
    return players[index];
  }, [game]);

  if (!startingPlayer) {
    return null; // Or a loading state
  }

  return (
    <div className="flex items-center justify-center h-full">
      <div className="container mx-auto max-w-md space-y-8 w-full text-center">
        <h1 className="text-4xl font-bold text-foreground">
          {startingPlayer.getName()}
        </h1>
        <p className="text-lg text-muted-foreground">{t("ui.starts_game")}</p>

        <div className="flex flex-col gap-4 pt-4">
          <Button onClick={onRestartGame} size="lg" className="w-full">
            {t("ui.restart_game")}
          </Button>
          <Button
            onClick={onBackToSetup}
            variant="outline"
            size="lg"
            className="w-full"
          >
            {t("ui.change_settings")}
          </Button>
        </div>
      </div>
    </div>
  );
};
