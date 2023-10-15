import { RulesetOutput, RulesetInput } from '@/types/Ruleset'
import { gql, useQuery, useMutation } from '@apollo/client'
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
import { Ruleset } from '@/types/Ruleset'

const GET_RULES = gql`
  query allTournaments($limit: Int, $offset: Int) {
    allRulesets(limit: $limit, offset: $offset) {
      id
      name
      rounds
      winnerpoints
      loserpoints
      drawpoints
      nightmarepoints
      nightmarePointsOn
    }
  }
`

const SAVE_RULESET = gql`
  mutation createRuleset($ruleset: RulesetInput!) {
    createRuleset(input: $ruleset) {
      name
      rounds
      winnerpoints
      loserpoints
      drawpoints
      nightmarepoints
      nightmarePointsOn
      id
    }
  }
`

const DELETE_RULESET = gql`
  mutation deleteRuleset($id: ID!) {
    deleteRuleset(id: $id)
  }
`

function RulesView({
  tourneyRuleset,
  setTourneyRuleset,
}: {
  tourneyRuleset: RulesetOutput
  setTourneyRuleset: React.Dispatch<React.SetStateAction<RulesetOutput>>
}) {
  const [rulesets, setRulesets] = useState<RulesetOutput[]>([tourneyRuleset])

  const [index, setIndex] = useState<number>(0)
  useQuery(GET_RULES, {
    variables: { limit: 50, offset: 0 },
    onCompleted: (completedData) => {
      setRulesets([...rulesets, ...completedData.allRulesets])
    },
  })
  const [mutateFunction] = useMutation(SAVE_RULESET)
  const [deleteRulesetMutation] = useMutation(DELETE_RULESET)

  const setRuleFormFields = (key: string | number) => {
    // find the index of the ruleset in the rulesets array
    const i = rulesets.findIndex((ruleset) => ruleset.id === key)
    if (i === -1) {
      alert('Ruleset not found')
    }
    setIndex(i)
    setTourneyRuleset(rulesets[i])
  }

  const saveRuleset = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const name = (form[0] as HTMLInputElement).value
    const rounds = parseInt((form[1] as HTMLInputElement).value)
    const winnerpoints = parseInt((form[2] as HTMLInputElement).value)
    const loserpoints = parseInt((form[3] as HTMLInputElement).value)
    const drawpoints = parseInt((form[4] as HTMLInputElement).value)
    const nightmarePointsOn = (form[5] as HTMLInputElement).checked
    const nightmarepoints = parseInt((form[6] as HTMLInputElement).value)

    const result = await mutateFunction({
      variables: {
        ruleset: {
          name,
          rounds,
          winnerpoints,
          loserpoints,
          drawpoints,
          nightmarepoints,
          nightmarePointsOn,
        },
      },
    })

    if (result && result.data) {
      setRulesets([...rulesets, result.data.createRuleset])
    }
    if (result && result.errors) {
      console.log('errors', result.errors)
    }
  }

  const deleteSelectedRuleset = async () => {
    if (window.confirm('Do you really want to delete this ruleset?')) {
      const result = await deleteRulesetMutation({
        variables: {
          id: rulesets[index].id,
        },
      })
      if (result && result.data) {
        setRulesets([...rulesets.slice(0, index), ...rulesets.slice(index + 1)])
        alert('Ruleset deleted')
      } else {
        alert('Ruleset not deleted')
      }
    }
  }
  return (
    <div className="space-y-4">
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
          {(ruleset: any) => <DropdownItem key={ruleset.id}>{ruleset.name}</DropdownItem>}
        </DropdownMenu>
      </Dropdown>
      {index == 0 ? (
        <form onSubmit={saveRuleset} className="space-y-4">
          <h2>Custom ruleset</h2>
          <Input label="Ruleset name" type="string" defaultValue={rulesets[0].name.toString()} />
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
          <Button type="submit" color="primary">
            Save ruleset
          </Button>
        </form>
      ) : (
        <div className="max-w-md">
          <div className="space-y-1">
            <h4 className="text-medium font-medium">{rulesets[index].name}</h4>
          </div>
          <Button onClick={deleteSelectedRuleset} color="danger">
            Delete ruleset
          </Button>

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
