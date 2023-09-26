import { Ruleset, RulesetInput } from '@/types/Ruleset'
import { gql, useMutation, useQuery } from '@apollo/client'
import { getDataFromTree } from '@apollo/client/react/ssr'
import {
  Button,
  Checkbox,
  Divider,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Input,
} from '@nextui-org/react'
import { set } from 'mongoose'
import React, { useState } from 'react'

const GET_RULES = gql`
  query allTournaments($limit: Int, $offset: Int) {
    allRulesets(limit: $limit, offset: $offset) {
      id
      rounds
      winnerpoints
      loserpoints
      drawpoints
      nightmarepoints
      nightmarePointsOn
    }
  }
`

const customRule: RulesetInput = {
  id: 'custom',
  rounds: 3,
  winnerpoints: 3,
  loserpoints: 0,
  drawpoints: 1,
  nightmarepoints: 0,
  nightmarePointsOn: false,
}

function RulesView() {
  const [rulesets, setRulesets] = useState<RulesetInput[]>([customRule])
  const [index, setIndex] = useState<number>(0)
  const { loading, error, data } = useQuery(GET_RULES, {
    variables: { limit: 10, offset: 0 },
    onCompleted: (completedData) => {
      setRulesets([...rulesets, ...completedData.allRulesets])
    },
  })

  console.log('rules', rulesets)

  const setRuleFormFields = (key: string | number) => {
    // find the index of the ruleset in the rulesets array
    const i = rulesets.findIndex((ruleset) => ruleset.id === key)
    if (i === -1) {
      setIndex(0)
    }
    setIndex(i)
    console.log('index', index)

    console.log(rulesets[index].rounds)
    console.log(rulesets[index].winnerpoints)
    console.log(rulesets[index].loserpoints)
    console.log(rulesets[index].drawpoints)
    console.log(rulesets[index].nightmarePointsOn)
  }

  return (
    <div>
      <h2>Ruleset</h2>
      <Dropdown>
        <DropdownTrigger>
          <Button variant="bordered">Select a ruleset</Button>
        </DropdownTrigger>
        <DropdownMenu
          aria-label="Dynamic Actions"
          onAction={(key) => setRuleFormFields(key)}
          items={rulesets}
        >
          {(ruleset) => <DropdownItem key={ruleset.id}>{ruleset.id}</DropdownItem>}
        </DropdownMenu>
      </Dropdown>
      {index == 0 ? (
        <form>
          <Input label="Rounds" type="number" defaultValue={rulesets[index].rounds.toString()} />
          <Input
            label="Winner Points"
            type="number"
            defaultValue={rulesets[0].winnerpoints.toString()}
          />
          <Input
            label="Loser Points"
            type="number"
            defaultValue={rulesets[0].loserpoints.toString()}
          />
          <Input
            label="Draw Points"
            type="number"
            defaultValue={rulesets[0].drawpoints.toString()}
          />
          {/* // checkbox on click to set nightmarePointsOn to true or false for the first element */}
          <Checkbox
            defaultSelected
            onValueChange={() =>
              setRulesets([
                { ...rulesets[0], nightmarePointsOn: !rulesets[0].nightmarePointsOn },
                ...rulesets.slice(1),
              ])
            }
          >
            Nighmare poins on {rulesets[0].nightmarePointsOn.toString()}
          </Checkbox>
          <Input
            label="Nightmare Points"
            type="number"
            disabled={!rulesets[0].nightmarePointsOn}
            defaultValue={rulesets[0].nightmarepoints.toString()}
          />
        </form>
      ) : (
        <div className="max-w-md">
          <div className="space-y-1">
            <h4 className="text-medium font-medium">Ruleset {rulesets[index].id}</h4>
            <p className="text-small text-default-400">
              4 hours later...
            </p>
          </div>
          <Divider className="my-4" />
          <div className="h-5 items-center space-y-4 text-small">
            <div>Points gain for win: {rulesets[index].winnerpoints.toString()}</div>
            <Divider orientation="horizontal" />
            <div>Points loss for defeat: {rulesets[index].loserpoints.toString()}</div>
            <Divider orientation="horizontal" />
            <div>Points change from a draw: {rulesets[index].drawpoints.toString()}</div>
            <Divider orientation="horizontal" />
            <div>
              {rulesets[index].nightmarePointsOn
                ? 'Nightmare mode enabled'
                : 'nightmare mode disabled'}
            </div>
            <Divider orientation="horizontal" />
            <div>Nightmare mode points: {rulesets[index].nightmarepoints.toString()}</div>
          </div>
        </div>
      )}
    </div>
  )
}

export default RulesView
