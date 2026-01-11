import { SetupCard } from "@/components/setup-card";
import { Button } from "@/components/ui/button";
import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/ui/native-select";
import { Switch } from "@/components/ui/switch";
import {
  ChevronRight,
  Eye,
  Lightbulb,
  Play,
  Tag,
  Users,
  TrendingUp,
} from "lucide-react";
import { Player } from "@/domain/player/player.entity";
import { playerManagementService } from "@/application/services";
import { categoryManagementService } from "@/application/services";
import { IMPOSTOR_CONSTANTS } from "@/constants";
import { useMemo } from "react";
import { useTranslation } from "@/i18n";

type GameSetupProps = {
  onOpenPlayers: () => void;
  onOpenCategories: () => void;
  players: Player[];
  selectedCategories: string[];
  impostorCount: number;
  onImpostorCountChange: (count: number) => void;
  hintsEnabled: boolean;
  onHintsEnabledChange: (enabled: boolean) => void;
  difficulty: number | null;
  onDifficultyChange: (difficulty: number | null) => void;
  onStartGame: () => void;
};

export const GameSetup = ({
  onOpenPlayers,
  onOpenCategories,
  players,
  selectedCategories,
  impostorCount,
  onImpostorCountChange,
  hintsEnabled,
  onHintsEnabledChange,
  difficulty,
  onDifficultyChange,
  onStartGame,
}: GameSetupProps) => {
  const readyPlayersCount =
    playerManagementService.getReadyPlayersCount(players);
  const selectedCategoriesCount =
    categoryManagementService.getSelectedCount(selectedCategories);

  // Calculate valid impostor options based on player count
  const maxImpostors = useMemo(() => {
    return IMPOSTOR_CONSTANTS.getMaxImpostorsForPlayerCount(readyPlayersCount);
  }, [readyPlayersCount]);

  const validImpostorOptions = useMemo(() => {
    const options: number[] = [];
    for (let i = IMPOSTOR_CONSTANTS.MIN_IMPOSTORS; i <= maxImpostors; i++) {
      options.push(i);
    }
    return options;
  }, [maxImpostors]);

  // Ensure current impostor count is valid
  const currentImpostorCount = useMemo(() => {
    if (
      IMPOSTOR_CONSTANTS.isValidImpostorCount(impostorCount, readyPlayersCount)
    ) {
      return impostorCount;
    }
    // If invalid, default to the minimum
    const validCount = Math.min(IMPOSTOR_CONSTANTS.MIN_IMPOSTORS, maxImpostors);
    if (validCount !== impostorCount) {
      onImpostorCountChange(validCount);
    }
    return validCount;
  }, [impostorCount, readyPlayersCount, maxImpostors, onImpostorCountChange]);

  const handleImpostorCountChange = (value: string) => {
    const newCount = parseInt(value, 10);
    if (IMPOSTOR_CONSTANTS.isValidImpostorCount(newCount, readyPlayersCount)) {
      onImpostorCountChange(newCount);
    }
  };

  const { t } = useTranslation();

  // Check if we can start the game (at least 2 ready players required)
  const canStartGame = readyPlayersCount >= 2;

  return (
    <div className="container mx-auto flex flex-col h-full">
      <div className="flex-1">
        {/* Players Card */}
        <SetupCard
          icon={<Users className="h-4 w-4 text-white" />}
          iconBg="bg-blue-500"
          title={t("ui.players")}
          subtitle={
            readyPlayersCount > 0
              ? `${readyPlayersCount} ${readyPlayersCount === 1 ? t("ui.player_singular") : t("ui.player_plural")}`
              : t("ui.add_players_first")
          }
          right={<ChevronRight className="h-4 w-4 text-muted-foreground" />}
          onClick={onOpenPlayers}
        />

        <SetupCard
          icon={<Tag className="h-4 w-4 text-white" />}
          iconBg="bg-purple-500"
          title={t("ui.categories")}
          subtitle={
            selectedCategoriesCount > 0
              ? `${selectedCategoriesCount} ${selectedCategoriesCount === 1 ? t("ui.selected") : t("ui.selected_plural")}`
              : t("ui.all_categories")
          }
          right={<ChevronRight className="h-4 w-4 text-muted-foreground" />}
          onClick={onOpenCategories}
          className="mt-2"
        />

        <SetupCard
          icon={<Eye className="h-4 w-4 text-white" />}
          iconBg="bg-orange-500"
          title={t("ui.impostors")}
          subtitle={
            readyPlayersCount > 0
              ? `${currentImpostorCount} ${t("ui.of")} ${maxImpostors}`
              : t("ui.add_players_first")
          }
          right={
            <NativeSelect
              value={currentImpostorCount.toString()}
              onChange={(e) => handleImpostorCountChange(e.target.value)}
              disabled={readyPlayersCount === 0}
            >
              {validImpostorOptions.map((count) => (
                <NativeSelectOption key={count} value={count.toString()}>
                  {count}
                </NativeSelectOption>
              ))}
            </NativeSelect>
          }
          className="mt-2"
        />

        <SetupCard
          icon={<Lightbulb className="h-4 w-4 text-white" />}
          iconBg="bg-green-500"
          title={t("ui.hints")}
          subtitle={hintsEnabled ? t("ui.enabled") : t("ui.disabled")}
          right={
            <Switch
              checked={hintsEnabled}
              onCheckedChange={onHintsEnabledChange}
            />
          }
          className="mt-2"
        />

        <SetupCard
          icon={<TrendingUp className="h-4 w-4 text-white" />}
          iconBg="bg-indigo-500"
          title={t("ui.difficulty")}
          right={
            <NativeSelect
              value={difficulty === null ? "all" : difficulty.toString()}
              onChange={(e) => {
                const value = e.target.value;
                onDifficultyChange(
                  value === "all" ? null : parseInt(value, 10)
                );
              }}
            >
              <NativeSelectOption value="all">
                {t("ui.all_difficulties")}
              </NativeSelectOption>
              <NativeSelectOption value="1">
                {t("ui.difficulty_low")}
              </NativeSelectOption>
              <NativeSelectOption value="2">
                {t("ui.difficulty_medium")}
              </NativeSelectOption>
              <NativeSelectOption value="3">
                {t("ui.difficulty_high")}
              </NativeSelectOption>
            </NativeSelect>
          }
          className="mt-2"
        />
      </div>

      <Button className="w-full" onClick={onStartGame} disabled={!canStartGame}>
        <Play className="h-6 w-6" />
        {t("ui.start_game")}
      </Button>
    </div>
  );
};
