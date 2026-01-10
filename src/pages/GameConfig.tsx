import { useState } from 'react'
import { useTranslation, translateKey } from '@/i18n'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Checkbox } from '@/components/ui/checkbox'
import { LanguageSwitcher } from '@/components/ui/language-switcher'
import { CATEGORIES } from '@/data/categories'
import type { GameConfig } from '@/types/game-config.types'

export interface GameConfigProps {
  readonly initialConfig: GameConfig
  readonly onStartGame: (config: GameConfig) => void
  readonly onBack: () => void
}

export function GameConfig({ initialConfig, onStartGame, onBack }: GameConfigProps) {
  const { t } = useTranslation()
  const [showHint, setShowHint] = useState(initialConfig.showHint)
  const [selectedCategories, setSelectedCategories] = useState<Set<string>>(
    new Set(initialConfig.selectedCategoryIds)
  )

  const handleCategoryToggle = (categoryId: string) => {
    setSelectedCategories(prev => {
      const newSet = new Set(prev)
      if (newSet.has(categoryId)) {
        newSet.delete(categoryId)
      } else {
        newSet.add(categoryId)
      }
      return newSet
    })
  }

  const handleSelectAll = () => {
    if (selectedCategories.size === CATEGORIES.length) {
      // Deselect all
      setSelectedCategories(new Set())
    } else {
      // Select all
      setSelectedCategories(new Set(CATEGORIES.map(c => c.id)))
    }
  }

  const handleStart = () => {
    const config: GameConfig = {
      showHint,
      selectedCategoryIds: Array.from(selectedCategories),
    }
    onStartGame(config)
  }

  const allSelected = selectedCategories.size === CATEGORIES.length
  const noneSelected = selectedCategories.size === 0

  return (
    <div className="min-h-dvh bg-purple-50/80 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-2xl">
        {/* Language Switcher */}
        <div className="flex justify-end mb-4">
          <LanguageSwitcher />
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-purple-900 mb-2">
            {t('ui.game_config')}
          </h1>
          <p className="text-gray-600">{t('ui.game_config_subtitle')}</p>
        </div>

        {/* Hint Toggle */}
        <div className="mb-8">
          <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg">
            <div className="flex-1">
              <h3 className="font-semibold text-purple-900 mb-1">
                {t('ui.show_hint')}
              </h3>
              <p className="text-sm text-gray-600">{t('ui.show_hint_description')}</p>
            </div>
            <Switch checked={showHint} onCheckedChange={setShowHint} />
          </div>
        </div>

        {/* Categories */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex-1">
              <h3 className="font-semibold text-purple-900">
                {t('ui.categories')}
              </h3>
              {noneSelected && (
                <p className="text-sm text-gray-500 mt-1">
                  {t('ui.all_categories_selected')}
                </p>
              )}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleSelectAll}
              className="text-sm"
            >
              {allSelected ? t('ui.deselect_all') : t('ui.select_all')}
            </Button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {CATEGORIES.map(category => (
              <div
                key={category.id}
                className={`flex items-center space-x-3 p-3 border rounded-lg cursor-pointer transition-colors min-w-0 ${selectedCategories.has(category.id)
                  ? 'border-purple-500 bg-purple-50'
                  : 'border-gray-200 hover:border-purple-300'
                  }`}
                onClick={() => handleCategoryToggle(category.id)}
              >
                <Checkbox
                  checked={selectedCategories.has(category.id)}
                  onCheckedChange={() => handleCategoryToggle(category.id)}
                />
                <label className="text-sm font-medium cursor-pointer flex-1 min-w-0 break-words">
                  {translateKey(t, category.nameKey)}
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Button onClick={onBack} variant="outline" className="flex-1" size="lg">
            {t('ui.back')}
          </Button>
          <Button
            onClick={handleStart}
            className="flex-1"
            size="lg"
          >
            {t('ui.start_game')}
          </Button>
        </div>
      </div>
    </div>
  )
}
