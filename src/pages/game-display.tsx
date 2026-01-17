import { useState } from "react";
import { Game } from "@/domain/game/game.aggregate";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/i18n";
import { EyeOff, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";

type GameDisplayProps = {
  game: Game;
  hintsEnabled: boolean;
  onGameChange: (game: Game) => void;
  onStartGame?: () => void;
};

export const GameDisplay = ({
  game,
  hintsEnabled,
  onGameChange,
  onStartGame,
}: GameDisplayProps) => {
  const { t } = useTranslation();
  const [selectedPlayerId, setSelectedPlayerId] = useState<string | null>(null);
  const [flippedPlayerId, setFlippedPlayerId] = useState<string | null>(null);

  const players = game.getPlayers();
  const word = game.getWord();
  const revealedCount = players.filter((p) => p.hasSeenRole()).length;

  const selectedPlayer = selectedPlayerId
    ? players.find((p) => p.getId() === selectedPlayerId)
    : null;

  const handleCardClick = (playerId: string) => {
    const player = players.find((p) => p.getId() === playerId);
    if (!player || player.hasSeenRole()) {
      return;
    }
    setSelectedPlayerId(playerId);
    setFlippedPlayerId(null);
  };

  const handleFlipCard = () => {
    if (!selectedPlayerId) return;

    const updatedGame = game.markPlayerAsSeenRole(selectedPlayerId);
    setFlippedPlayerId(selectedPlayerId);
    onGameChange(updatedGame);
  };

  const handleCloseReveal = () => {
    setSelectedPlayerId(null);
    setFlippedPlayerId(null);
  };

  const allCardsRevealed = revealedCount === players.length;

  return (
    <div className="flex flex-col h-full relative">
      <div className="container mx-auto w-full flex-1 flex flex-col gap-6 overflow-y-auto">
        <div className="flex items-center justify-center gap-2 flex-wrap">
          <p className="hidden text-muted-foreground md:block">
            {t("ui.select_card_to_reveal")}
          </p>
          <Badge variant="secondary">
            {t("ui.players_revealed", {
              revealed: revealedCount,
              total: players.length,
            })}
          </Badge>
        </div>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {players.map((player) => {
            const isRevealed = player.hasSeenRole();

            return (
              <button
                key={player.getId()}
                type="button"
                disabled={isRevealed}
                onClick={() => !isRevealed && handleCardClick(player.getId())}
                className={cn(
                  "bg-card text-card-foreground flex flex-col justify-center items-center rounded-xl border shadow-sm aspect-square transition-all duration-200 relative",
                  !isRevealed &&
                    "hover:bg-primary/10 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                  isRevealed && "bg-muted opacity-75 cursor-not-allowed"
                )}
                aria-label={`${player.getName()} - ${
                  isRevealed ? t("ui.ready") : t("ui.tap_to_reveal")
                }`}
              >
                <p className="text-lg font-semibold text-card-foreground">
                  {player.getName()}
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  {isRevealed ? t("ui.ready") : t("ui.tap_to_reveal")}
                </p>
              </button>
            );
          })}
        </div>

        {allCardsRevealed && onStartGame && (
          <div className="mt-auto">
            <Button className="w-full" onClick={onStartGame} size="lg">
              {t("ui.start_game")}
            </Button>
          </div>
        )}
      </div>

      {selectedPlayer && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="mx-auto max-w-sm space-y-6 w-full">
            <div className="space-y-2 text-center">
              <h2 className="text-2xl font-bold text-foreground">
                {selectedPlayer.getName()}
              </h2>
            </div>

            <div className="relative">
              <Card
                className={cn(
                  "min-w-xs backdrop-blur-sm transition-all duration-500",
                  flippedPlayerId === selectedPlayer.getId() && "scale-105"
                )}
              >
                <CardContent className="w-full p-6">
                  {flippedPlayerId !== selectedPlayer.getId() ? (
                    <div className="flex flex-col items-center justify-center space-y-4 transition-opacity duration-300">
                      <div className="space-y-3 text-center">
                        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                          <EyeOff className="h-8 w-8 text-muted-foreground" />
                        </div>
                        <p className="text-base text-muted-foreground">
                          {t("ui.ready_to_reveal")}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center transition-opacity duration-300 text-center space-y-3">
                      {selectedPlayer.isImpostor() ? (
                        <div className="space-y-4">
                          {hintsEnabled && (
                            <div>
                              <p className="text-sm font-medium text-muted-foreground">
                                {t("ui.word_label")}
                              </p>
                              <p className="text-3xl font-bold text-card-foreground">
                                {t(word.getHintKey())}
                              </p>
                            </div>
                          )}
                          <div>
                            <p className="text-base font-medium text-muted-foreground">
                              {t("ui.role_label")}
                            </p>
                            <p className="text-2xl font-bold text-destructive ">
                              {t("ui.you_are_impostor")}
                            </p>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">
                              {t("ui.word_label")}
                            </p>
                            <p className="text-3xl font-bold text-card-foreground">
                              {t(word.getWordKey())}
                            </p>
                          </div>
                          <div>
                            <p className="text-base font-medium text-muted-foreground">
                              {t("ui.role_label")}
                            </p>
                            <p className="text-2xl font-bold text-green-600 ">
                              {t("ui.you_are_normal")}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            <div className="mb-4 space-y-3">
              {flippedPlayerId !== selectedPlayer.getId() ? (
                <Button className="w-full" onClick={handleFlipCard} size="lg">
                  <RotateCcw className="mr-2 h-5 w-5" />
                  {t("ui.flip_card")}
                </Button>
              ) : (
                <Button
                  className="w-full"
                  onClick={handleCloseReveal}
                  size="lg"
                >
                  {t("ui.close")}
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
