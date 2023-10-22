import React, { useState } from 'react'
import { Radio, RadioGroup, Tooltip } from '@nextui-org/react'
import { User } from '@/types/User'

interface RadioGroupComponentProps {
  matchPlayers: User[]
  isVisible: boolean
  onClose: () => void
  onConfirm: (result: {
    player1_id: string | null
    player2_id: string | null
    resultType: 'player-1' | 'player-2' | 'tie'
  }) => void
}

const RadioGroupComponent: React.FC<RadioGroupComponentProps> = ({
  matchPlayers,
  isVisible,
  onClose,
  onConfirm,
}) => {
  const [selectedValue, setSelectedValue] = useState<'player-1' | 'player-2' | 'tie' | null>(null)

  const handleConfirmClick = () => {
    if (selectedValue) {
      const player1_id = matchPlayers[0].id
      const player2_id = matchPlayers[1].id
      console.log(selectedValue, 'selectedValue in RadioGroupComponent')

      onConfirm({
        player1_id,
        player2_id,
        resultType: selectedValue,
      })

      handleClose()
    }
  }

  const handleRadioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedValue(event.target.value as 'player-1' | 'player-2' | 'tie' | null)
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
