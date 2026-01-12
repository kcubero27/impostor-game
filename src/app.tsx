import "@/i18n/config";
import { HomePage } from "@/pages/home-page";
import { GameSetup } from "@/pages/game-setup";
import { PlayersSetup } from "@/pages/players-setup";
import { CategoriesSetup } from "@/pages/categories-setup";
import { GameDisplay } from "@/pages/game-display";
import { GameStart } from "@/pages/game-start";
import { Layout } from "@/components/layout";
import { useEffect } from "react";
import { gameManagementService } from "@/application/services";
import { useTranslation, i18n } from "@/i18n";
import { useAppState } from "@/state/app-state.hook";
import { SCREEN } from "@/state/app-state.types";
import { Game } from "@/domain/game/game.aggregate";

function App() {
  const { t } = useTranslation();
  const {
    state,
    navigateToSetup,
    navigateToHome,
    navigateToPlayers,
    navigateToCategories,
    navigateToGameStart,
    setPlayers,
    setSelectedCategories,
    setImpostorCount,
    setHintsEnabled,
    setDifficulty,
    setGame,
    startGame,
    restartGame,
    clearGame,
  } = useAppState();

  const {
    screen,
    players,
    selectedCategories,
    impostorCount,
    hintsEnabled,
    difficulty,
    game,
  } = state;

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

  const handleInitConfiguration = () => {
    navigateToSetup();
  };

  const handleBackToHome = () => {
    navigateToHome();
  };

  const handleBackToSetup = () => {
    navigateToSetup();
  };

  const handleOpenPlayers = () => {
    navigateToPlayers();
  };

  const handleOpenCategories = () => {
    navigateToCategories();
  };

  const handleStartGame = () => {
    const readyPlayers = players.filter((p) => p.hasValidName());
    if (!Game.canStart(readyPlayers.length)) {
      return;
    }

    const newGame = gameManagementService.startGame(
      readyPlayers,
      impostorCount,
      selectedCategories,
      difficulty
    );
    startGame(newGame);
  };

  const handleStartGameFromDisplay = () => {
    if (!game) return;
    navigateToGameStart();
  };

  const handleRestartGame = () => {
    const readyPlayers = players.filter((p) => p.hasValidName());
    if (readyPlayers.length < 2) {
      return;
    }

    const newGame = gameManagementService.startGame(
      readyPlayers,
      impostorCount,
      selectedCategories,
      difficulty
    );
    restartGame(newGame);
  };

  const handleBackToSetupFromGameStart = () => {
    clearGame();
  };

  const handleBackToSetupFromGameDisplay = () => {
    clearGame();
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
        return undefined;
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
