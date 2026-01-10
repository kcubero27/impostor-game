// Export react-i18next hook and i18n instance
export { useTranslation } from 'react-i18next'
export { default as i18n } from './config'
export type { TranslationResource } from './locales'

// Helper to safely translate a key (avoids "as" casting)
export function translateKey(t: (key: string) => string, key: string): string {
  return t(key)
}
