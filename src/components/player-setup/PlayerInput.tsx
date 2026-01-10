import { memo, type ChangeEvent } from 'react'
import { Trash2 } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export interface PlayerInputProps {
  readonly index: number
  readonly value: string
  readonly onChange: (value: string) => void
  readonly onRemove: () => void
  readonly canRemove: boolean
  readonly placeholder?: string
}

function PlayerInputComponent({
  index,
  value,
  onChange,
  onRemove,
  canRemove,
  placeholder,
}: PlayerInputProps) {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value)
  }

  const displayPlaceholder = placeholder ?? `Player ${index + 1} name`

  return (
    <div className="flex items-center gap-3">
      <span className="text-muted-foreground font-medium min-w-[24px]">
        {index + 1}.
      </span>
      <Input
        type="text"
        placeholder={displayPlaceholder}
        value={value}
        onChange={handleChange}
        className="flex-1"
        aria-label={displayPlaceholder}
      />
      <Button
        variant="ghost"
        size="icon"
        onClick={onRemove}
        disabled={!canRemove}
        className="text-muted-foreground hover:text-destructive disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label={`Remove player ${index + 1}`}
      >
        <Trash2 className="w-4 h-4" aria-hidden="true" />
      </Button>
    </div>
  )
}

export const PlayerInput = memo(PlayerInputComponent)
PlayerInput.displayName = 'PlayerInput'
