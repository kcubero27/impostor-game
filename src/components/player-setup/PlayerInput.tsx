import { memo, forwardRef, type ChangeEvent } from 'react'
import { Trash2 } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useTranslation } from '@/i18n'

export interface PlayerInputProps {
  readonly index: number
  readonly value: string
  readonly onChange: (value: string) => void
  readonly onRemove: () => void
  readonly canRemove: boolean
  readonly hasError?: boolean
}

const PlayerInputComponent = forwardRef<HTMLInputElement, PlayerInputProps>(
  (
    { index, value, onChange, onRemove, canRemove, hasError = false },
    ref
  ) => {
    const { t } = useTranslation()
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
      onChange(e.target.value)
    }

    const displayPlaceholder = t('ui.player_name_placeholder', { number: index + 1 })
    const removeLabel = t('ui.remove_player', { number: index + 1 })

    return (
      <div className="flex items-center gap-3">
        <span className="text-muted-foreground font-medium min-w-[24px]">
          {index + 1}.
        </span>
        <Input
          ref={ref}
          type="text"
          placeholder={displayPlaceholder}
          value={value}
          onChange={handleChange}
          className={`flex-1 ${hasError ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
          aria-label={displayPlaceholder}
          aria-invalid={hasError}
        />
        <Button
          variant="ghost"
          size="icon"
          onClick={onRemove}
          disabled={!canRemove}
          className="text-muted-foreground hover:text-destructive disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label={removeLabel}
        >
          <Trash2 className="w-4 h-4" aria-hidden="true" />
        </Button>
      </div>
    )
  }
)

PlayerInputComponent.displayName = 'PlayerInput'

export const PlayerInput = memo(PlayerInputComponent)
