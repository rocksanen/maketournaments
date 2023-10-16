import { User } from '@/types/User'
import { Button, Card, Spinner } from '@nextui-org/react'
import React, { useEffect, useState } from 'react'
import formatTime from '@/utils/formatTime'
import { useGameTimer } from '@/components/hooks/useTimer'

interface matchPlayersProps {
  matchPlayers: User[]
}

const MatchPlayers: React.FC<matchPlayersProps> = ({ matchPlayers }) => {
  const [gameStarted, setGameStarted] = useState(false)
  const { timeElapsed, setTimeElapsed, timerInterval, setTimerInterval } = useGameTimer({
    gameStarted,
  })

  const handleStartClick = () => {
    setGameStarted(true)
  }

  const handleEndClick = () => {
    setGameStarted(false)
  }
  return (
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
      </div>
    </div>
  )
}

export default MatchPlayers
