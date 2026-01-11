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
      return; // Don't allow clicking on already revealed cards
    }
    setSelectedPlayerId(playerId);
    setFlippedPlayerId(null);
  };

  const handleFlipCard = () => {
    if (!selectedPlayerId) return;

    // Mark player as having seen their role
    const updatedGame = game.markPlayerAsSeenRole(selectedPlayerId);
    setFlippedPlayerId(selectedPlayerId);
    onGameChange(updatedGame);
  };

  const handleCloseReveal = () => {
    setSelectedPlayerId(null);
    setFlippedPlayerId(null);
  };

  // If a card is selected, show the reveal modal
  if (selectedPlayer) {
    const isFlipped = flippedPlayerId === selectedPlayer.getId();
    const isImpostor = selectedPlayer.isImpostor();
    const wordText = t(word.getWordKey());
    const hintText = t(word.getHintKey());

    return (
      <div className="flex items-center justify-center h-full">
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
                isFlipped && "scale-105"
              )}
            >
              <CardContent className="w-full p-6">
                {!isFlipped ? (
                  <div className="flex flex-col items-center justify-center space-y-4 transition-opacity duration-300">
                    <div className="space-y-3 text-center">
                      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                        <EyeOff className="h-8 w-8 text-muted-foreground" />
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {t("ui.ready_to_reveal")}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center space-y-4 transition-opacity duration-300">
                    <div className="space-y-3 text-center">
                      {isImpostor ? (
                        <>
                          <h3 className="text-xl font-bold text-destructive">
                            {t("ui.you_are_impostor")}
                          </h3>
                          {hintsEnabled ? (
                            <div className="space-y-2">
                              <p className="text-sm text-muted-foreground">
                                {t("ui.impostor_hint")}
                              </p>
                              <p className="text-lg font-semibold text-card-foreground">
                                {hintText}
                              </p>
                            </div>
                          ) : (
                            <p className="text-sm text-muted-foreground">
                              {t("ui.no_hint_message")}
                            </p>
                          )}
                        </>
                      ) : (
                        <>
                          <h3 className="text-xl font-bold text-primary">
                            {t("ui.you_are_normal")}
                          </h3>
                          <div className="space-y-2">
                            <p className="text-sm text-muted-foreground">
                              {t("ui.the_word_is")}
                            </p>
                            <p className="text-lg font-semibold text-card-foreground">
                              {wordText}
                            </p>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="mb-4 space-y-3">
            {!isFlipped ? (
              <Button className="w-full" onClick={handleFlipCard}>
                <RotateCcw className="mr-2 h-5 w-5" />
                {t("ui.flip_card")}
              </Button>
            ) : (
              <Button className="w-full" onClick={handleCloseReveal}>
                {t("ui.close")}
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  }

  const allCardsRevealed = revealedCount === players.length;

  // Show the grid of player cards
  return (
    <div className="flex flex-col h-full">
      <div className="container mx-auto w-full flex-1 flex flex-col gap-6">
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
              <Card
                key={player.getId()}
                className={cn(
                  "aspect-square transition-all duration-300",
                  !isRevealed && "hover:scale-105 cursor-pointer",
                  isRevealed && "bg-muted opacity-75 cursor-not-allowed"
                )}
                onClick={() => !isRevealed && handleCardClick(player.getId())}
              >
                <CardContent className="flex flex-col justify-center items-center space-y-2 p-4 h-full text-center">
                  <p className="text-lg font-semibold text-card-foreground">
                    {player.getName()}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {isRevealed ? t("ui.ready") : t("ui.tap_to_reveal")}
                  </p>
                </CardContent>
              </Card>
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
    </div>
  );
};
