import { useState, useCallback } from 'react'
import { PlayerSetup } from '@/pages/PlayerSetup'
import { GameConfig } from '@/pages/GameConfig'
import { RoleReveal } from '@/pages/RoleReveal'
import type { GameState, GameConfig as GameConfigType } from '@/types'
import { DEFAULT_GAME_CONFIG } from '@/types'
import { gameManagementService } from '@/application/services'
import { GameAdapter } from '@/adapters/game.adapter'
import { PlayerAdapter } from '@/adapters/player.adapter'
import '@/i18n/config' // Initialize i18next
import './App.css'

type Screen = 'setup' | 'config' | 'game'

function App() {
  const [screen, setScreen] = useState<Screen>('setup')
  const [gameState, setGameState] = useState<GameState | null>(null)
  const [players, setPlayers] = useState<{ id: string; name: string }[]>([])
  const [gameConfig, setGameConfig] = useState<GameConfigType>(DEFAULT_GAME_CONFIG)

  const handleContinueToConfig = useCallback((playerList: { id: string; name: string }[]) => {
    setPlayers(playerList)
    setScreen('config')
  }, [])

  const handleStartGame = useCallback((config: GameConfigType) => {
    // Store the config
    setGameConfig(config)

    // Convert legacy player DTOs to domain entities
    const domainPlayers = PlayerAdapter.toDomainArray(players)

    // Use application service to start game with config
    const game = gameManagementService.startGame(domainPlayers, config)

    // Convert to legacy GameState for UI compatibility
    const newGameState = GameAdapter.toGameStateDto(game, config)
    setGameState(newGameState)
    setScreen('game')
  }, [players])

  const handlePlayAgain = useCallback(() => {
    // Go back to config screen to allow changing settings
    setScreen('config')
  }, [])

  const handleClose = useCallback(() => {
    setScreen('setup')
    setGameState(null)
    setPlayers([])
    setGameConfig(DEFAULT_GAME_CONFIG)
  }, [])

  const handleBackToSetup = useCallback(() => {
    setScreen('setup')
  }, [])

  return (
    <>
      {screen === 'setup' && <PlayerSetup onStartGame={handleContinueToConfig} />}
      {screen === 'config' && (
        <GameConfig
          initialConfig={gameConfig}
          onStartGame={handleStartGame}
          onBack={handleBackToSetup}
        />
      )}
      {screen === 'game' && gameState && (
        <RoleReveal
          gameState={gameState}
          onPlayAgain={handlePlayAgain}
          onClose={handleClose}
        />
      )}
    </>
  )
}

export default App
