import "@/i18n/config";
import { HomePage } from "@/pages/home-page";
import { GameSetup } from "@/pages/game-setup";
import { PlayersSetup } from "@/pages/players-setup";
import { CategoriesSetup } from "@/pages/categories-setup";
import { GameDisplay } from "@/pages/game-display";
import { GameStart } from "@/pages/game-start";
import { Layout } from "@/components/layout";
import { useState, useEffect } from "react";
import { Player } from "@/domain/player/player.entity";
import { Game } from "@/domain/game/game.aggregate";
import {
  playerManagementService,
  gameManagementService,
} from "@/application/services";
import { IMPOSTOR_CONSTANTS } from "@/constants";
import { useTranslation, i18n } from "@/i18n";

// Helper function to get default player name
const getDefaultPlayerName = (index: number): string => {
  const translation = i18n.t("ui.player_name_placeholder", {
    number: index + 1,
  });
  // Remove "Nombre del " or "Name of " prefix if present
  const name = translation.replace(/^(Nombre del |Name of )/i, "");
  // Capitalize first letter
  return name.charAt(0).toUpperCase() + name.slice(1);
};

const SCREEN = {
  HOME: "home",
  GAME_SETUP: "game-setup",
  PLAYERS_SETUP: "players-setup",
  CATEGORIES_SETUP: "categories-setup",
  GAME: "game",
  GAME_START: "game-start",
} as const;

type Screen = (typeof SCREEN)[keyof typeof SCREEN];

function App() {
  const { t } = useTranslation();

  // Update document title when language changes
  useEffect(() => {
    const updateTitle = () => {
      document.title = t("ui.app_title");
    };

    updateTitle();
    i18n.on("languageChanged", updateTitle);

    return () => {
      i18n.off("languageChanged", updateTitle);
    };
  }, [t]);

  const [screen, setScreen] = useState<Screen>(SCREEN.HOME);
  const [players, setPlayers] = useState<Player[]>(() => {
    // Initialize with 3 players using domain entities with default names
    return [
      playerManagementService.createPlayer(getDefaultPlayerName(0)),
      playerManagementService.createPlayer(getDefaultPlayerName(1)),
      playerManagementService.createPlayer(getDefaultPlayerName(2)),
    ];
  });
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [impostorCount, setImpostorCount] = useState<number>(
    IMPOSTOR_CONSTANTS.MIN_IMPOSTORS
  );
  const [hintsEnabled, setHintsEnabled] = useState<boolean>(true);
  const [difficulty, setDifficulty] = useState<number | null>(null); // null = all difficulties
  const [game, setGame] = useState<Game | null>(null);

  const handleInitConfiguration = () => {
    setScreen(SCREEN.GAME_SETUP);
  };

  const handleBackToHome = () => {
    setScreen(SCREEN.HOME);
  };

  const handleBackToSetup = () => {
    setScreen(SCREEN.GAME_SETUP);
  };

  const handleOpenPlayers = () => {
    setScreen(SCREEN.PLAYERS_SETUP);
  };

  const handleOpenCategories = () => {
    setScreen(SCREEN.CATEGORIES_SETUP);
  };

  const handleStartGame = () => {
    // Filter to get only ready players (players with valid names)
    const readyPlayers = players.filter((p) => p.hasValidName());
    if (readyPlayers.length < 2) {
      return; // Should not happen, but safety check
    }

    const newGame = gameManagementService.startGame(
      readyPlayers,
      impostorCount,
      selectedCategories,
      difficulty
    );
    setGame(newGame);
    setScreen(SCREEN.GAME);
  };

  const handleStartGameFromDisplay = () => {
    if (!game) return;
    setScreen(SCREEN.GAME_START);
  };

  const handleRestartGame = () => {
    // Filter to get only ready players (players with valid names)
    const readyPlayers = players.filter((p) => p.hasValidName());
    if (readyPlayers.length < 2) {
      return; // Should not happen, but safety check
    }

    const newGame = gameManagementService.startGame(
      readyPlayers,
      impostorCount,
      selectedCategories,
      difficulty
    );
    setGame(newGame);
    setScreen(SCREEN.GAME);
  };

  const handleBackToSetupFromGameStart = () => {
    setGame(null);
    setScreen(SCREEN.GAME_SETUP);
  };

  const handleBackToSetupFromGameDisplay = () => {
    setGame(null);
    setScreen(SCREEN.GAME_SETUP);
  };

  const getScreenTitle = () => {
    switch (screen) {
      case SCREEN.GAME_SETUP:
        return t("ui.game_setup");
      case SCREEN.PLAYERS_SETUP:
        return t("ui.players");
      case SCREEN.CATEGORIES_SETUP:
        return t("ui.categories");
      case SCREEN.GAME:
        return t("ui.choose_your_card");
      case SCREEN.GAME_START:
        return undefined; // Game start doesn't need a title
      default:
        return undefined;
    }
  };

  const getBackHandler = () => {
    switch (screen) {
      case SCREEN.GAME_SETUP:
        return handleBackToHome;
      case SCREEN.PLAYERS_SETUP:
      case SCREEN.CATEGORIES_SETUP:
        return handleBackToSetup;
      case SCREEN.GAME:
        return handleBackToSetupFromGameDisplay;
      case SCREEN.GAME_START:
        return undefined; // Disable back button on game start screen
      default:
        return undefined;
    }
  };

  return (
    <Layout title={getScreenTitle()} onBack={getBackHandler()}>
      {screen === SCREEN.HOME && (
        <HomePage onInitGame={handleInitConfiguration} />
      )}
      {screen === SCREEN.GAME_SETUP && (
        <GameSetup
          onOpenPlayers={handleOpenPlayers}
          onOpenCategories={handleOpenCategories}
          players={players}
          selectedCategories={selectedCategories}
          impostorCount={impostorCount}
          onImpostorCountChange={setImpostorCount}
          hintsEnabled={hintsEnabled}
          onHintsEnabledChange={setHintsEnabled}
          difficulty={difficulty}
          onDifficultyChange={setDifficulty}
          onStartGame={handleStartGame}
        />
      )}
      {screen === SCREEN.PLAYERS_SETUP && (
        <PlayersSetup players={players} onPlayersChange={setPlayers} />
      )}
      {screen === SCREEN.CATEGORIES_SETUP && (
        <CategoriesSetup
          selectedCategories={selectedCategories}
          onCategoriesChange={setSelectedCategories}
        />
      )}
      {screen === SCREEN.GAME && game && (
        <GameDisplay
          game={game}
          hintsEnabled={hintsEnabled}
          onGameChange={setGame}
          onStartGame={handleStartGameFromDisplay}
        />
      )}
      {screen === SCREEN.GAME_START && game && (
        <GameStart
          game={game}
          onRestartGame={handleRestartGame}
          onBackToSetup={handleBackToSetupFromGameStart}
        />
      )}
    </Layout>
  );
}

export default App;
