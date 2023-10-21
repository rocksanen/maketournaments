import { Ruleset } from '@/types/Ruleset'

let winner: number
let loser: number
let draw: number

export const awardPointsBasedOnMatchOutcome = (ruleset: Ruleset | undefined) => {
  if (ruleset) {
    const { winnerpoints, loserpoints, drawpoints } = ruleset
    winner = winnerpoints
    loser = loserpoints
    draw = drawpoints
  } else {
    console.error('Invalid ruleset provided')
  }
}

export const getPoints = () => {
  return {
    winner,
    loser,
    draw,
  }
}
