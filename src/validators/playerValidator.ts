export interface ValidationResult {
  isValid: boolean
  error?: string
}

export const playerValidator = {
  validatePlayerName: (name: string): ValidationResult => {
    if (name.trim().length === 0) {
      return { isValid: false, error: 'Player name cannot be empty' }
    }
    if (name.trim().length < 2) {
      return { isValid: false, error: 'Player name must be at least 2 characters' }
    }
    if (name.trim().length > 50) {
      return { isValid: false, error: 'Player name must be less than 50 characters' }
    }
    return { isValid: true }
  },

  validateMinPlayers: (count: number, minPlayers: number): ValidationResult => {
    if (count < minPlayers) {
      return {
        isValid: false,
        error: `At least ${minPlayers} players are required`,
      }
    }
    return { isValid: true }
  },
}
