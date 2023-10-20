import React, { useState } from 'react'
import { Radio, RadioGroup, Tooltip } from '@nextui-org/react'
import { User } from '@/types/User'

interface RadioGroupComponentProps {
  matchPlayers: User[]
  isVisible: boolean
  onClose: () => void
  onConfirm: (winner: 'player-1' | 'player-2' | 'tie') => void // Added prop for handling confirm.
}

const RadioGroupComponent: React.FC<RadioGroupComponentProps> = ({
  matchPlayers,
  isVisible,
  onClose,
  onConfirm,
}) => {
  const [selectedValue, setSelectedValue] = useState<string | null>(null)

  const handleConfirmClick = () => {
    // New handler for confirming a result
    if (selectedValue) {
      onConfirm(selectedValue as 'player-1' | 'player-2' | 'tie')
      handleClose()
    }
  }

  const handleRadioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedValue(event.target.value)
  }

  const handleClose = () => {
    resetSelectedValue()
    onClose()
  }

  const resetSelectedValue = () => {
    setSelectedValue(null)
  }

  if (!isVisible) return null

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="bg-black p-4 rounded radio-group-scaled transparent-borderResult">
        <RadioGroup
          label="SELECT RESULT"
          onChange={handleRadioChange}
          style={{ textAlign: 'center', color: '#fff' }}
        >
          <Radio value="player-1">{matchPlayers[0].name}</Radio>
          <Radio value="tie">Draw</Radio>
          <Radio value="player-2">{matchPlayers[1].name}</Radio>
        </RadioGroup>
        <div className="button-container">
          <Tooltip content={!selectedValue ? 'Please choose a result!' : ''}>
            <button
              className="flex-button transparent-borderRight p-1 rounded"
              onClick={handleConfirmClick} // Updated to use handleConfirmClick
              disabled={!selectedValue}
            >
              Confirm
            </button>
          </Tooltip>
          <button className="flex-button transparent-borderLeft p-1 rounded" onClick={handleClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}

export default RadioGroupComponent
