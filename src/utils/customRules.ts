import { RulesetOutput } from '@/types/Ruleset'

export const customRule: RulesetOutput = {
  id: 'custom',
  name: 'Create a new ruleset',
  rounds: 3,
  winnerpoints: 3,
  loserpoints: 0,
  drawpoints: 1,
  nightmarepoints: 0,
  nightmarePointsOn: false,
}
