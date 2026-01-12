import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2 } from "lucide-react";
import { useTranslation } from "@/i18n";
import { Player } from "@/domain/player/player.entity";
import { PlayerCollection } from "@/domain/player/player-collection";
import { playerManagementService } from "@/application/services";
import { PlayerAdapter } from "@/adapters/player.adapter";
import { cn } from "@/lib/utils";

type PlayersSetupProps = {
  players: Player[];
  onPlayersChange: (players: Player[]) => void;
};

export const PlayersSetup = ({
  players,
  onPlayersChange,
}: PlayersSetupProps) => {
  const { t } = useTranslation();
  const [newPlayerId, setNewPlayerId] = useState<string | null>(null);
  const [touchedInputs, setTouchedInputs] = useState<Set<string>>(new Set());
  const [rawInputValues, setRawInputValues] = useState<{
    [key: string]: string;
  }>({});
  const inputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});

  const addPlayer = () => {
    const nextIndex = players.length;
    const defaultName = t("ui.player_name_placeholder", {
      number: nextIndex + 1,
    }).replace(/^(Nombre del |Name of )/i, "");
    const capitalizedName =
      defaultName.charAt(0).toUpperCase() + defaultName.slice(1);

    const newPlayer = playerManagementService.createPlayer(capitalizedName);
    const updatedPlayers = [...players, newPlayer];
    onPlayersChange(updatedPlayers);

    // Initialize input value for new player
    setRawInputValues((prev) => ({
      ...prev,
      [newPlayer.getId()]: capitalizedName,
    }));

    setNewPlayerId(newPlayer.getId());
  };

  const removePlayer = (id: string) => {
    const updatedPlayers = playerManagementService.removePlayer(players, id);
    onPlayersChange(updatedPlayers);
    setRawInputValues((prev) => {
      const rest = { ...prev };
      delete rest[id];
      return rest;
    });
    setTouchedInputs((prev) => {
      const newSet = new Set(prev);
      newSet.delete(id);
      return newSet;
    });
    if (newPlayerId === id) {
      setNewPlayerId(null);
    }
  };

  const updatePlayerName = (id: string, name: string) => {
    setRawInputValues((prev) => ({ ...prev, [id]: name }));
    const updatedPlayers = playerManagementService.updatePlayerName(
      players,
      id,
      name
    );
    onPlayersChange(updatedPlayers);
    if (!touchedInputs.has(id)) {
      setTouchedInputs((prev) => new Set(prev).add(id));
    }
  };

  const playerDtos = PlayerAdapter.toDtoArray(players);
  const playersCount = players.length;
  const readyPlayersCount = PlayerCollection.getReadyPlayersCount(players);
  const allPlayersHaveNames =
    PlayerCollection.allPlayersHaveValidNames(players);
  const allNamesAreUnique = PlayerCollection.allNamesAreUnique(players);
  const isReady = allPlayersHaveNames && allNamesAreUnique;

  const hasDuplicateName = (playerId: string, playerName: string): boolean => {
    return PlayerCollection.hasDuplicateName(players, playerId, playerName);
  };

  useEffect(() => {
    if (newPlayerId && inputRefs.current[newPlayerId]) {
      setTimeout(() => {
        inputRefs.current[newPlayerId]?.focus();
        setNewPlayerId(null);
      }, 0);
    }
  }, [newPlayerId]);

  return (
    <div className="container mx-auto flex flex-col h-full">
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">
          {t("ui.minimum_players_required")}
        </span>
        <Badge variant="secondary">
          {readyPlayersCount}/{playersCount} {t("ui.player_plural")}
        </Badge>
      </div>
      {!isReady && !allNamesAreUnique && allPlayersHaveNames && (
        <div className="mt-2 text-sm text-destructive">
          {t("ui.duplicate_names")}
        </div>
      )}
      <div className="flex-1 overflow-y-auto mt-2">
        {playerDtos.map((player, index) => {
          const displayValue = rawInputValues[player.id] ?? player.name;
          const hasDuplicate = hasDuplicateName(player.id, displayValue);
          const showValidation = hasDuplicate;

          return (
            <Card
              key={player.id}
              className={cn(
                "gap-0 py-0",
                index > 0 && "mt-2",
                showValidation && "border-destructive"
              )}
            >
              <CardContent className="p-0">
                <div className="flex items-center py-2 px-4">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <Input
                      ref={(el) => {
                        inputRefs.current[player.id] = el;
                      }}
                      value={displayValue}
                      onChange={(e) =>
                        updatePlayerName(player.id, e.target.value)
                      }
                      onBlur={() => {
                        if (!touchedInputs.has(player.id)) {
                          setTouchedInputs((prev) =>
                            new Set(prev).add(player.id)
                          );
                        }
                      }}
                      placeholder={t("ui.player_name_placeholder", {
                        number: index + 1,
                      })}
                      className="flex-1 min-w-0 border-0 shadow-none focus:outline-none focus:ring-0 focus:ring-offset-0 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent h-auto"
                      aria-invalid={showValidation}
                    />
                  </div>
                  {players.length > 3 && (
                    <div className="flex items-center gap-1 ml-2 shrink-0">
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => removePlayer(player.id)}
                      >
                        <Trash2 className="h-3 w-3" />
                        <span className="sr-only">
                          {t("ui.remove_player", { number: index + 1 })}
                        </span>
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Button className="w-full" onClick={addPlayer}>
        <Plus className="h-4 w-4" />
        {t("ui.add_player")}
      </Button>
    </div>
  );
};
