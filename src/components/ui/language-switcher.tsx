import { useState, useRef, useEffect } from 'react'
import { useTranslation } from '@/i18n'
import { Globe, Check } from 'lucide-react'
import { Button } from './button'

// Languages available - currently only Spanish, but prepared for future additions
const LANGUAGES = [
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  // Future languages can be added here, for example:
  // { code: 'en', name: 'English', flag: '🇬🇧' },
] as const

export function LanguageSwitcher() {
  const { i18n, t } = useTranslation()
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const handleLanguageChange = (languageCode: string) => {
    i18n.changeLanguage(languageCode)
    setIsOpen(false)
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  return (
    <div className="relative" ref={dropdownRef}>
      <Button
        variant="ghost"
        size="icon-sm"
        onClick={() => setIsOpen(!isOpen)}
        aria-label={t('ui.select_language')}
        aria-expanded={isOpen}
        className="text-gray-600 hover:text-gray-900 hover:bg-gray-100"
      >
        <Globe className="h-5 w-5" />
      </Button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
          {LANGUAGES.map((lang) => {
            const isSelected = i18n.language === lang.code
            return (
              <button
                key={lang.code}
                onClick={() => handleLanguageChange(lang.code)}
                className={`w-full px-4 py-2 text-left flex items-center gap-3 hover:bg-gray-100 transition-colors ${isSelected ? 'bg-purple-50' : ''
                  }`}
                aria-current={isSelected ? 'true' : 'false'}
              >
                <span className="text-xl" aria-hidden="true">
                  {lang.flag}
                </span>
                <span className="flex-1 text-sm font-medium text-gray-700">
                  {lang.name}
                </span>
                {isSelected && (
                  <Check className="h-4 w-4 text-purple-600" aria-hidden="true" />
                )}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
