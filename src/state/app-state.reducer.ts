import type { AppState, AppAction } from "./app-state.types";
import { SCREEN } from "./app-state.types";

export function appStateReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case "SET_SCREEN":
      return { ...state, screen: action.payload };

    case "SET_PLAYERS":
      return { ...state, players: action.payload };

    case "SET_SELECTED_CATEGORIES":
      return { ...state, selectedCategories: action.payload };

    case "SET_IMPOSTOR_COUNT":
      return { ...state, impostorCount: action.payload };

    case "SET_HINTS_ENABLED":
      return { ...state, hintsEnabled: action.payload };

    case "SET_DIFFICULTY":
      return { ...state, difficulty: action.payload };

    case "SET_GAME":
      return { ...state, game: action.payload };

    case "START_GAME":
      return {
        ...state,
        game: action.payload,
        screen: SCREEN.GAME,
      };

    case "RESTART_GAME":
      return {
        ...state,
        game: action.payload,
        screen: SCREEN.GAME,
      };

    case "CLEAR_GAME":
      return {
        ...state,
        game: null,
        screen: SCREEN.GAME_SETUP,
      };

    case "NAVIGATE_TO_HOME":
      return { ...state, screen: SCREEN.HOME };

    case "NAVIGATE_TO_SETUP":
      return { ...state, screen: SCREEN.GAME_SETUP };

    case "NAVIGATE_TO_PLAYERS":
      return { ...state, screen: SCREEN.PLAYERS_SETUP };

    case "NAVIGATE_TO_CATEGORIES":
      return { ...state, screen: SCREEN.CATEGORIES_SETUP };

    case "NAVIGATE_TO_GAME":
      return { ...state, screen: SCREEN.GAME };

    case "NAVIGATE_TO_GAME_START":
      return { ...state, screen: SCREEN.GAME_START };

    default:
      return state;
  }
}
