import { useContext } from "react";
import {
  AppStateContext,
  type AppStateContextValue,
} from "./app-state.context";

export function useAppState(): AppStateContextValue {
  const context = useContext(AppStateContext);
  if (context === undefined) {
    throw new Error("useAppState must be used within an AppStateProvider");
  }
  return context;
}
