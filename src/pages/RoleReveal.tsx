import { useState, useCallback, useEffect } from 'react'
import { type GameState } from '@/types'
import { useTranslation, translateKey } from '@/i18n'
import { Button } from '@/components/ui/button'
import { LanguageSwitcher } from '@/components/ui/language-switcher'

export interface RoleRevealProps {
  readonly gameState: GameState
  readonly onPlayAgain: () => void
  readonly onClose: () => void
}

export function RoleReveal({ gameState, onPlayAgain, onClose }: RoleRevealProps) {
  const { t } = useTranslation()
  const [isRevealed, setIsRevealed] = useState(false)
  const [localGameState, setLocalGameState] = useState(gameState)

  useEffect(() => {
    setLocalGameState(gameState)
  }, [gameState])

  const currentPlayer = localGameState.players[localGameState.currentPlayerIndex]
  const isLastPlayer = localGameState.currentPlayerIndex === localGameState.players.length - 1

  const handleReveal = useCallback(() => {
    setIsRevealed(true)
    // Mark this player as having seen their role
    setLocalGameState(prev => ({
      ...prev,
      players: prev.players.map((player, index) =>
        index === prev.currentPlayerIndex
          ? { ...player, hasSeenRole: true }
          : player
      ),
    }))
  }, [])

  const handleNext = useCallback(() => {
    setLocalGameState(prev => {
      const nextIndex = prev.currentPlayerIndex + 1
      const isComplete = nextIndex >= prev.players.length

      return {
        ...prev,
        currentPlayerIndex: nextIndex,
        isComplete,
      }
    })
    setIsRevealed(false)
  }, [])

  // If game is complete, show the "All Ready" screen
  if (localGameState.isComplete) {
    return (
      <div className="min-h-dvh bg-purple-50/80 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-lg text-center">
          {/* Language Switcher */}
          <div className="flex justify-end mb-4">
            <LanguageSwitcher />
          </div>

          <div className="mb-6">
            <div className="w-20 h-20 bg-green-100 rounded-full mx-auto mb-4 flex items-center justify-center">
              <span className="text-4xl">✓</span>
            </div>
            <h1 className="text-3xl font-bold text-purple-900 mb-2">{t('ui.all_ready')}</h1>
            <p className="text-gray-600">
              {t('ui.players')}: {localGameState.players.length}
            </p>
          </div>

          <div className="space-y-3">
            <Button onClick={onPlayAgain} className="w-full" size="lg">
              {t('ui.play_again')}
            </Button>
            <Button onClick={onClose} variant="outline" className="w-full" size="lg">
              {t('ui.close')}
            </Button>
          </div>
        </div>
      </div>
    )
  }

  // Show current player's turn
  if (!currentPlayer) {
    return null
  }

  const nextPlayer = localGameState.players[localGameState.currentPlayerIndex + 1]
  const isImpostor = currentPlayer.role === 'impostor'

  return (
    <div className="min-h-screen bg-purple-50/80 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-lg">
        {/* Language Switcher */}
        <div className="flex justify-end mb-4">
          <LanguageSwitcher />
        </div>

        {!isRevealed ? (
          // Before revealing - show player name and ready button
          <div className="text-center">
            <div className="mb-6">
              <div className="w-24 h-24 bg-purple-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-5xl">👤</span>
              </div>
              <h2 className="text-2xl font-bold text-purple-900 mb-2">
                {currentPlayer.name || `Player ${localGameState.currentPlayerIndex + 1}`}
              </h2>
              <p className="text-gray-600">{t('ui.your_role')}</p>
            </div>

            <Button onClick={handleReveal} className="w-full" size="lg">
              {t('ui.ready')}
            </Button>
          </div>
        ) : (
          // After revealing - show role and word/hint
          <div className="text-center">
            <div className="mb-6">
              {/* Role Display */}
              <div
                className={`w-28 h-28 rounded-full mx-auto mb-4 flex items-center justify-center ${isImpostor ? 'bg-red-100' : 'bg-blue-100'
                  }`}
              >
                <span className="text-6xl">{isImpostor ? '🎭' : '👥'}</span>
              </div>

              <h2
                className={`text-2xl font-bold mb-4 ${isImpostor ? 'text-red-600' : 'text-blue-600'
                  }`}
              >
                {isImpostor ? t('ui.you_are_impostor') : t('ui.you_are_normal')}
              </h2>

              {/* Word or Hint Display */}
              <div className="bg-purple-50 rounded-xl p-6 mb-6">
                {isImpostor ? (
                  // Impostor sees hint (if enabled) or nothing
                  localGameState.config.showHint ? (
                    <>
                      <p className="text-sm text-gray-600 mb-2">
                        {t('ui.impostor_hint')}
                      </p>
                      <p className="text-3xl font-bold text-purple-900">
                        {localGameState.word ? translateKey(t, localGameState.word.hintKey) : ''}
                      </p>
                    </>
                  ) : (
                    <>
                      <p className="text-sm text-gray-600 mb-2">{t('ui.you_are_impostor')}</p>
                      <p className="text-lg text-gray-700">
                        {t('ui.no_hint_message')}
                      </p>
                    </>
                  )
                ) : (
                  // Normal player sees the word
                  <>
                    <p className="text-sm text-gray-600 mb-2">{t('ui.the_word_is')}</p>
                    <p className="text-4xl font-bold text-purple-900">
                      {localGameState.word ? translateKey(t, localGameState.word.wordKey) : ''}
                    </p>
                  </>
                )}
              </div>
            </div>

            {/* Next button */}
            <div className="space-y-2">
              {!isLastPlayer && nextPlayer && (
                <p className="text-sm text-gray-600 mb-2">
                  {t('ui.pass_to')}{' '}
                  <span className="font-semibold">
                    {nextPlayer.name || `Player ${localGameState.currentPlayerIndex + 2}`}
                  </span>
                </p>
              )}
              <Button onClick={handleNext} className="w-full" size="lg">
                {isLastPlayer ? t('ui.all_ready') : t('ui.next_player')}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

