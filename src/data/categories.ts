import { type Category } from "./types";

export const CATEGORIES: readonly Category[] = [
  { id: "animals", nameKey: "category.animals", emoji: "🐾" },
  { id: "food", nameKey: "category.food", emoji: "🍕" },
  { id: "sports", nameKey: "category.sports", emoji: "⚽" },
  { id: "professions", nameKey: "category.professions", emoji: "💼" },
  { id: "objects", nameKey: "category.objects", emoji: "📦" },
  { id: "places", nameKey: "category.places", emoji: "🗺️" },
  { id: "technology", nameKey: "category.technology", emoji: "💻" },
  { id: "nature", nameKey: "category.nature", emoji: "🌿" },
  { id: "transportation", nameKey: "category.transportation", emoji: "🚗" },
  { id: "entertainment", nameKey: "category.entertainment", emoji: "🎬" },
  { id: "clothing", nameKey: "category.clothing", emoji: "👕" },
  { id: "household", nameKey: "category.household", emoji: "🏠" },
] as const;
