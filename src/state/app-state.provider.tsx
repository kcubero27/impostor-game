import { useReducer, useCallback, useMemo } from "react";
import type { ReactNode } from "react";
import type { Player } from "@/domain/player/player.entity";
import type { Game } from "@/domain/game/game.aggregate";
import type { AppState } from "./app-state.types";
import { SCREEN } from "./app-state.types";
import { appStateReducer } from "./app-state.reducer";
import { playerManagementService } from "@/application/services";
import { IMPOSTOR_CONSTANTS } from "@/constants";
import { i18n } from "@/i18n";
import {
  AppStateContext,
  type AppStateContextValue,
} from "./app-state.context";

const getDefaultPlayerName = (index: number): string => {
  return i18n.t("ui.player_name_placeholder", {
    number: index + 1,
  });
};

const getInitialState = (): AppState => ({
  screen: SCREEN.HOME,
  players: [
    playerManagementService.createPlayer(getDefaultPlayerName(0)),
    playerManagementService.createPlayer(getDefaultPlayerName(1)),
    playerManagementService.createPlayer(getDefaultPlayerName(2)),
  ],
  selectedCategories: [],
  impostorCount: IMPOSTOR_CONSTANTS.MIN_IMPOSTORS,
  hintsEnabled: true,
  difficulty: null,
  game: null,
});

interface AppStateProviderProps {
  children: ReactNode;
}

export function AppStateProvider({ children }: AppStateProviderProps) {
  const [state, dispatch] = useReducer(appStateReducer, getInitialState());

  const setScreen = useCallback((screen: AppState["screen"]) => {
    dispatch({ type: "SET_SCREEN", payload: screen });
  }, []);

  const setPlayers = useCallback((players: Player[]) => {
    dispatch({ type: "SET_PLAYERS", payload: players });
  }, []);

  const setSelectedCategories = useCallback((categories: string[]) => {
    dispatch({ type: "SET_SELECTED_CATEGORIES", payload: categories });
  }, []);

  const setImpostorCount = useCallback((count: number) => {
    dispatch({ type: "SET_IMPOSTOR_COUNT", payload: count });
  }, []);

  const setHintsEnabled = useCallback((enabled: boolean) => {
    dispatch({ type: "SET_HINTS_ENABLED", payload: enabled });
  }, []);

  const setDifficulty = useCallback((difficulty: number | null) => {
    dispatch({ type: "SET_DIFFICULTY", payload: difficulty });
  }, []);

  const setGame = useCallback((game: Game | null) => {
    dispatch({ type: "SET_GAME", payload: game });
  }, []);

  const navigateToHome = useCallback(() => {
    dispatch({ type: "NAVIGATE_TO_HOME" });
  }, []);

  const navigateToSetup = useCallback(() => {
    dispatch({ type: "NAVIGATE_TO_SETUP" });
  }, []);

  const navigateToPlayers = useCallback(() => {
    dispatch({ type: "NAVIGATE_TO_PLAYERS" });
  }, []);

  const navigateToCategories = useCallback(() => {
    dispatch({ type: "NAVIGATE_TO_CATEGORIES" });
  }, []);

  const navigateToGame = useCallback(() => {
    dispatch({ type: "NAVIGATE_TO_GAME" });
  }, []);

  const navigateToGameStart = useCallback(() => {
    dispatch({ type: "NAVIGATE_TO_GAME_START" });
  }, []);

  const startGame = useCallback((game: Game) => {
    dispatch({ type: "START_GAME", payload: game });
  }, []);

  const restartGame = useCallback((game: Game) => {
    dispatch({ type: "RESTART_GAME", payload: game });
  }, []);

  const clearGame = useCallback(() => {
    dispatch({ type: "CLEAR_GAME" });
  }, []);

  const value = useMemo<AppStateContextValue>(
    () => ({
      state,
      dispatch,
      setScreen,
      setPlayers,
      setSelectedCategories,
      setImpostorCount,
      setHintsEnabled,
      setDifficulty,
      setGame,
      navigateToHome,
      navigateToSetup,
      navigateToPlayers,
      navigateToCategories,
      navigateToGame,
      navigateToGameStart,
      startGame,
      restartGame,
      clearGame,
    }),
    [
      state,
      dispatch,
      setScreen,
      setPlayers,
      setSelectedCategories,
      setImpostorCount,
      setHintsEnabled,
      setDifficulty,
      setGame,
      navigateToHome,
      navigateToSetup,
      navigateToPlayers,
      navigateToCategories,
      navigateToGame,
      navigateToGameStart,
      startGame,
      restartGame,
      clearGame,
    ]
  );

  return (
    <AppStateContext.Provider value={value}>
      {children}
    </AppStateContext.Provider>
  );
}
