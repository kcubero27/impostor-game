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

  const startingPlayer = useMemo<GamePlayer | null>(() => {
    const players = game.getPlayers();
    if (players.length === 0) return null;

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
    return null;
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
