import { memo } from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useTranslation } from '@/i18n'

export interface AddPlayerButtonProps {
  readonly onClick: () => void
  readonly className?: string
  readonly disabled?: boolean
}

function AddPlayerButtonComponent({
  onClick,
  className,
  disabled = false,
}: AddPlayerButtonProps) {
  const { t } = useTranslation()
  const label = t('ui.add_player')

  return (
    <Button
      onClick={onClick}
      disabled={disabled}
      className={`w-full bg-purple-300 hover:bg-purple-400 text-white shadow-sm ${
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
