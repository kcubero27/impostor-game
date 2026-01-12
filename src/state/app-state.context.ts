import { createContext, type Dispatch } from "react";
import type { AppAction } from "./app-state.types";
import type { AppState } from "./app-state.types";
import type { Player } from "@/domain/player/player.entity";
import type { Game } from "@/domain/game/game.aggregate";

export interface AppStateContextValue {
  state: AppState;
  dispatch: Dispatch<AppAction>;
  setScreen: (screen: AppState["screen"]) => void;
  setPlayers: (players: Player[]) => void;
  setSelectedCategories: (categories: string[]) => void;
  setImpostorCount: (count: number) => void;
  setHintsEnabled: (enabled: boolean) => void;
  setDifficulty: (difficulty: number | null) => void;
  setGame: (game: Game | null) => void;
  navigateToHome: () => void;
  navigateToSetup: () => void;
  navigateToPlayers: () => void;
  navigateToCategories: () => void;
  navigateToGame: () => void;
  navigateToGameStart: () => void;
  startGame: (game: Game) => void;
  restartGame: (game: Game) => void;
  clearGame: () => void;
}

export const AppStateContext = createContext<AppStateContextValue | undefined>(
  undefined
);
