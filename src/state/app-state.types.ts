import { Player } from "@/domain/player/player.entity";
import { Game } from "@/domain/game/game.aggregate";

export const SCREEN = {
  HOME: "home",
  GAME_SETUP: "game-setup",
  PLAYERS_SETUP: "players-setup",
  CATEGORIES_SETUP: "categories-setup",
  GAME: "game",
  GAME_START: "game-start",
} as const;

export type Screen = (typeof SCREEN)[keyof typeof SCREEN];

export interface AppState {
  screen: Screen;
  players: Player[];
  selectedCategories: string[];
  impostorCount: number;
  hintsEnabled: boolean;
  difficulty: number | null;
  game: Game | null;
}

export type AppAction =
  | { type: "SET_SCREEN"; payload: Screen }
  | { type: "SET_PLAYERS"; payload: Player[] }
  | { type: "SET_SELECTED_CATEGORIES"; payload: string[] }
  | { type: "SET_IMPOSTOR_COUNT"; payload: number }
  | { type: "SET_HINTS_ENABLED"; payload: boolean }
  | { type: "SET_DIFFICULTY"; payload: number | null }
  | { type: "SET_GAME"; payload: Game | null }
  | { type: "START_GAME"; payload: Game }
  | { type: "RESTART_GAME"; payload: Game }
  | { type: "CLEAR_GAME" }
  | { type: "NAVIGATE_TO_HOME" }
  | { type: "NAVIGATE_TO_SETUP" }
  | { type: "NAVIGATE_TO_PLAYERS" }
  | { type: "NAVIGATE_TO_CATEGORIES" }
  | { type: "NAVIGATE_TO_GAME" }
  | { type: "NAVIGATE_TO_GAME_START" };
