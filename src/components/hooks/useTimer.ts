import { useEffect, useState } from 'react'

interface UseGameTimerProps {
  gameStarted: boolean
}

export const useGameTimer = ({ gameStarted }: UseGameTimerProps) => {
  const [timeElapsed, setTimeElapsed] = useState(0)
  const [timerInterval, setTimerInterval] = useState<number | null>(null)

  useEffect(() => {
    if (gameStarted && timerInterval === null) {
      const intervalId = setInterval(() => {
        setTimeElapsed((prevTime) => prevTime + 1)
      }, 1000)
      setTimerInterval(intervalId as unknown as number)
    } else if (!gameStarted && timerInterval !== null) {
      clearInterval(timerInterval)
      setTimerInterval(null)
    }

    return () => {
      if (timerInterval !== null) {
        clearInterval(timerInterval)
      }
    }
  }, [gameStarted, timerInterval])

  return {
    timeElapsed,
    setTimeElapsed,
    timerInterval,
    setTimerInterval,
  }
}
