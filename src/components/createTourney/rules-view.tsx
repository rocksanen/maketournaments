import { RulesetOutput } from '@/types/Ruleset'
import { gql, useMutation, useQuery } from '@apollo/client'
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
import React, { useState } from 'react'
import { GET_RULES, SAVE_RULESET, DELETE_RULESET } from '@/graphql/clientQueries/rulesetOperations'

function RulesView({
  tourneyRuleset,
  setTourneyRuleset,
}: {
  tourneyRuleset: RulesetOutput
  setTourneyRuleset: React.Dispatch<React.SetStateAction<RulesetOutput>>
}) {
  const [rulesets, setRulesets] = useState<RulesetOutput[]>([tourneyRuleset])
  const [index, setIndex] = useState<number>(0)
  const [showForm, setShowForm] = useState(false)

  const [formValues, setFormValues] = useState({
    name: rulesets[index].name || '',
    rounds: 0,
    winnerpoints: 0,
    loserpoints: 0,
    drawpoints: 0,
    nightmarepoints: 0,
  })

  useQuery(GET_RULES, {
    variables: { limit: 50, offset: 0 },
    onCompleted: (completedData) => {
      setRulesets([...rulesets, ...completedData.allRulesets])
    },
  })

  const [mutateFunction] = useMutation(SAVE_RULESET)
  const [deleteRulesetMutation] = useMutation(DELETE_RULESET)

  const setRuleFormFields = (key: string | number) => {
    const i = rulesets.findIndex((ruleset) => ruleset.id === key)
    if (i === -1) {
      alert('Ruleset not found')
      return
    }
    setIndex(i)
    setTourneyRuleset(rulesets[i])
    setFormValues({
      name: rulesets[i].name,
      rounds: rulesets[i].rounds,
      winnerpoints: rulesets[i].winnerpoints,
      loserpoints: rulesets[i].loserpoints,
      drawpoints: rulesets[i].drawpoints,
      nightmarepoints: rulesets[i].nightmarepoints,
    })
    setShowForm(true) // Show the form once a ruleset is selected
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
      <h2>Rules</h2>
      <Dropdown>
        <DropdownTrigger>
          <Button variant="bordered">Select rules</Button>
        </DropdownTrigger>
        <DropdownMenu
          className="scrollable-dropdown dropdown-below"
          aria-label="Dynamic Actions"
          onAction={(key) => setRuleFormFields(key)}
          items={rulesets}
        >
          {(ruleset: any) => <DropdownItem key={ruleset.id}>{ruleset.name}</DropdownItem>}
        </DropdownMenu>
      </Dropdown>

      {showForm && (
        <form onSubmit={saveRuleset} className="space-y-4">
          <h2>{index === 0 ? 'Custom ruleset' : 'Selected ruleset'}</h2>
          {/* The form fields now use values from formValues */}
          <Input
            label="Ruleset name"
            type="string"
            value={formValues.name}
            onChange={(e) => setFormValues((prev) => ({ ...prev, name: e.target.value }))}
          />
          <Input
            label="Rounds"
            type="number"
            value={`${formValues.rounds}`}
            onChange={(e) =>
              setFormValues((prev) => ({ ...prev, rounds: parseInt(e.target.value) }))
            }
          />
          <Input
            label="Winner Points"
            type="number"
            value={`${formValues.winnerpoints}`}
            onChange={(e) =>
              setFormValues((prev) => ({ ...prev, winnerpoints: parseInt(e.target.value) }))
            }
          />
          <Input
            label="Loser Points"
            type="number"
            value={`${formValues.loserpoints}`}
            onChange={(e) =>
              setFormValues((prev) => ({ ...prev, loserpoints: parseInt(e.target.value) }))
            }
          />
          <Input
            label="Draw Points"
            type="number"
            value={`${formValues.drawpoints}`}
            onChange={(e) =>
              setFormValues((prev) => ({ ...prev, drawpoints: parseInt(e.target.value) }))
            }
          />
          <Input
            label="Nightmare Points"
            type="number"
            disabled={!rulesets[index].nightmarePointsOn}
            value={`${formValues.nightmarepoints}`}
            onChange={(e) =>
              setFormValues((prev) => ({ ...prev, nightmarepoints: parseInt(e.target.value) }))
            }
          />
          <Checkbox
            defaultSelected={rulesets[index].nightmarePointsOn}
            onValueChange={() =>
              setRulesets([
                ...rulesets.slice(0, index),
                { ...rulesets[index], nightmarePointsOn: !rulesets[index].nightmarePointsOn },
                ...rulesets.slice(index + 1),
              ])
            }
          >
            Nightmare points on {rulesets[index].nightmarePointsOn.toString()}
          </Checkbox>
          <Input
            label="Nightmare Points"
            type="number"
            disabled={!rulesets[index].nightmarePointsOn}
            value={formValues.nightmarepoints}
            onChange={(e) =>
              setFormValues((prev) => ({ ...prev, nightmarepoints: parseInt(e.target.value) }))
            }
          />
          {index === 0 ? (
            <Button type="submit" color="primary">
              Save ruleset
            </Button>
          ) : (
            <div className="max-w-md space-y-4">
              <Button onClick={deleteSelectedRuleset} color="danger">
                Delete ruleset
              </Button>
            </div>
          )}
        </form>
      )}
    </div>
  )
}

export default RulesView
