import { User } from '@/types/User'
import { Button, Card, Spinner, Radio, RadioGroup } from '@nextui-org/react'
import React, { useEffect, useState } from 'react'
import formatTime from '@/utils/formatTime'
import { useGameTimer } from '@/components/hooks/useTimer'
import RadioGroupComponent from './RadioGroupComponent'

interface matchPlayersProps {
  matchPlayers: User[]
  onEnd: (result: {
    player1_id: string | null
    player2_id: string | null
    resultType: 'player-1' | 'player-2' | 'tie'
  }) => void // Update this line
}

const MatchPlayers: React.FC<matchPlayersProps> = ({ matchPlayers, onEnd }) => {
  const [gameStarted, setGameStarted] = useState(false)
  const { timeElapsed } = useGameTimer({
    gameStarted,
  })
  const [isRadioGroupVisible, setRadioGroupVisible] = useState(false)

  const handleEndMatch = (result: {
    player1_id: string | null
    player2_id: string | null
    resultType: 'player-1' | 'player-2' | 'tie'
  }) => {
    setGameStarted(false)
    handleCloseRadioGroup()
    onEnd(result)
  }

  const handleStartClick = () => {
    setGameStarted(true)
  }

  const handleEndClick = () => {
    setRadioGroupVisible(true)
  }

  const handleCloseRadioGroup = () => {
    setRadioGroupVisible(false)
  }
  return (
    <>
      <div className="flex w-full flex-wrap md:flex-nowrap gap-2 ml-2">
        <Card className="h-14 w-1/5 justify-evenly items-center top-6 transparent-borderLeft">
          <p>{matchPlayers[0].name}</p>
        </Card>

        <div
          className="flex-center h-14 w-3/5"
          style={{ width: gameStarted ? '4%' : '0', transition: 'width 0.3s ease-in-out' }}
        >
          <Spinner color="secondary" style={{ visibility: gameStarted ? 'visible' : 'hidden' }} />
        </div>

        <Card className="h-14 w-1/5 justify-evenly items-center top-6 transparent-borderRight">
          <p>{matchPlayers[1].name}</p>
        </Card>

        <div className="mt-6 flex">
          {gameStarted ? (
            <>
              <Button className="ml-4 h-14 transparent-borderEnd" onClick={handleEndClick}>
                End Game
              </Button>
              <p
                className="ml-4 h-14 flex items-center"
                style={{
                  fontSize: '45px',
                  opacity: 0.7,
                }}
              >
                {formatTime(timeElapsed)}
              </p>
            </>
          ) : (
            <Button className="ml-2 h-14 transparent-borderStart" onClick={handleStartClick}>
              Start
            </Button>
          )}
          <RadioGroupComponent
            matchPlayers={matchPlayers}
            isVisible={isRadioGroupVisible}
            onClose={handleCloseRadioGroup}
            onConfirm={handleEndMatch} // Passing the new handler to the RadioGroupComponent
          />
        </div>
      </div>
    </>
  )
}

export default MatchPlayers
