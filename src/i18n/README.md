# Sistema de Internacionalización (i18n)

Este proyecto utiliza `react-i18next` para la gestión de traducciones.

## Estructura Actual

```
src/i18n/
├── config.ts           # Configuración de i18next
├── index.ts            # Exports principales
├── locales/
│   ├── index.ts       # Re-exporta las traducciones
│   └── es.json        # Traducciones en español
└── README.md          # Este archivo
```

## Idioma Actual

Actualmente el proyecto solo soporta **Español (ES)**, pero está preparado para agregar más idiomas fácilmente.

## Cómo Agregar un Nuevo Idioma

### 1. Crear el archivo JSON de traducciones

Crea un nuevo archivo en `src/i18n/locales/` con el código del idioma (por ejemplo, `en.json` para inglés):

```json
{
  "category.animals": "Animals",
  "category.food": "Food",
  "word.elephant": "Elephant",
  "hint.elephant": "Animal with trunk",
  "ui.game_title": "Impostor Game",
  ...
}
```

### 2. Actualizar `locales/index.ts`

Importa y exporta las nuevas traducciones:

```typescript
import esTranslations from './es.json'
import enTranslations from './en.json'  // Nuevo

export const es = esTranslations
export const en = enTranslations  // Nuevo

export type TranslationResource = typeof es
```

### 3. Actualizar `config.ts`

Agrega el nuevo idioma a la configuración:

```typescript
import { es, en } from './locales'  // Importa el nuevo idioma

i18next
  .use(initReactI18next)
  .init({
    resources: {
      es: {
        translation: es,
      },
      en: {  // Agrega el nuevo idioma
        translation: en,
      },
    },
    lng: typeof window !== 'undefined' ? localStorage.getItem('language') || 'es' : 'es',
    fallbackLng: 'es',
    // ... resto de la configuración
  })

// Agregar listener para guardar preferencia de idioma
i18next.on('languageChanged', (lng) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('language', lng)
  }
})
```

### 4. Actualizar el selector de idioma

En `components/ui/language-switcher.tsx`, agrega el nuevo idioma al array `LANGUAGES`:

```typescript
const LANGUAGES = [
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'en', name: 'English', flag: '🇬🇧' },  // Nuevo
] as const
```

### 5. Actualizar el tipo de Language

En `types/language.types.ts`, agrega el nuevo código de idioma:

```typescript
export type Language = 'es' | 'en'  // Agrega el nuevo código
```

## Uso de Traducciones en Componentes

```typescript
import { useTranslation } from '@/i18n'

function MyComponent() {
  const { t } = useTranslation()
  
  return (
    <div>
      <h1>{t('ui.game_title')}</h1>
      <p>{t('ui.game_subtitle')}</p>
    </div>
  )
}
```

## Interpolación de Variables

Para usar variables en las traducciones:

```json
{
  "ui.player_name_placeholder": "Nombre del jugador {{number}}"
}
```

```typescript
t('ui.player_name_placeholder', { number: 1 })
// Resultado: "Nombre del jugador 1"
```

## Estructura de Claves

Las claves de traducción siguen este patrón:

- `category.*` - Nombres de categorías
- `word.*` - Nombres de palabras
- `hint.*` - Pistas para las palabras
- `ui.*` - Textos de interfaz de usuario

## Notas Importantes

- Las traducciones están en formato JSON puro (no TypeScript)
- El selector de idioma se oculta automáticamente cuando solo hay un idioma disponible
- El idioma seleccionado se guarda en `localStorage` cuando hay múltiples idiomas
- Todos los archivos JSON deben tener la misma estructura de claves
