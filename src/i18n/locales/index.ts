// Import translations from JSON files
import esTranslations from "./es.json";
import caTranslations from "./ca.json";
import enTranslations from "./en.json";

// Export Spanish translations
export const es = esTranslations;

// Export Catalan translations
export const ca = caTranslations;

// Export English translations
export const en = enTranslations;

// Export type for translations
export type TranslationResource = typeof es;
