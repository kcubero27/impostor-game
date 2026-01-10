import i18next from 'i18next'
import { initReactI18next } from 'react-i18next'
import { es } from './locales'

// Initialize i18next
i18next
  .use(initReactI18next) // Pass i18next instance to react-i18next
  .init({
    resources: {
      es: {
        translation: es,
      },
    },
    lng: 'es', // Default and only language
    fallbackLng: 'es',
    interpolation: {
      escapeValue: false, // React already escapes values
    },
    react: {
      useSuspense: false, // Disable suspense for easier setup
    },
  })

export default i18next
