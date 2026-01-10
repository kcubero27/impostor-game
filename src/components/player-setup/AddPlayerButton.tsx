import { memo } from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'

export interface AddPlayerButtonProps {
  readonly onClick: () => void
  readonly label?: string
  readonly className?: string
  readonly disabled?: boolean
}

function AddPlayerButtonComponent({
  onClick,
  label = 'Add new player',
  className,
  disabled = false,
}: AddPlayerButtonProps) {
  return (
    <Button
      onClick={onClick}
      disabled={disabled}
      className={`w-full bg-purple-300 hover:bg-purple-400 text-white rounded-lg py-2 shadow-sm flex items-center justify-center gap-2 ${
        className ?? ''
      }`}
      aria-label={label}
    >
      <Plus className="w-5 h-5" aria-hidden="true" />
      <span>{label}</span>
    </Button>
  )
}

export const AddPlayerButton = memo(AddPlayerButtonComponent)
AddPlayerButton.displayName = 'AddPlayerButton'
