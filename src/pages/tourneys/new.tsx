'use client'
import React, { useState } from 'react'
import {
  Input,
  Checkbox,
  Button,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from '@nextui-org/react'
import { gql, useMutation } from '@apollo/client'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import RulesView from '@/components/createTourney/rules-view'
import { RulesetInput } from '@/types/Ruleset'

const newTourneyMutation = gql`
  mutation CreateTournament($input: CreateTournamentInput!) {
    createTournament(input: $input) {
      name
      ruleset {
        id
      }
      date
      admin {
        id
      }
      invitationOnly
      maxPlayers
    }
  }
`

const customRule: RulesetInput = {
  id: '65106775553dac66bcfac032',
  rounds: 3,
  winnerpoints: 3,
  loserpoints: 0,
  drawpoints: 1,
  nightmarepoints: 0,
  nightmarePointsOn: false,
}

function TourneysNew() {
  const [selectedKeys, setSelectedKeys] = React.useState(new Set(['Select Ruleset']))

  const [tourneyRuleset, setTourneyRuleset] = useState<RulesetInput>(customRule)

  const [hiddenField, setHiddenField] = useState('hidden')
  const [mutateFunction, { data, loading, error }] = useMutation(newTourneyMutation)
  const { data: session } = useSession()
  const router = useRouter()

  const newTourney = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const tourneyName = (form[0] as HTMLInputElement).value
    const maxPlayers = parseInt((form[2] as HTMLInputElement).value)

    const endDate = (form[3] as HTMLInputElement).value
    const invitationOnly = (form[4] as HTMLInputElement).checked

    console.log('tourneyRuleset', tourneyRuleset.id)
    console.log('tourneyName', tourneyName)
    console.log('maxPlayers', maxPlayers)
    console.log('endDate', endDate)
    console.log('invitationOnly', invitationOnly)
    console.log('session?.user?.id', session?.user?.id)

    if (!session?.user?.id) {
      alert('Please log in to create a tournament')
      return
    }

    if (!tourneyName || !maxPlayers || !endDate || !tourneyRuleset.id) {
      alert('Please fill out all fields')
      return
    }

    const result = await mutateFunction({
      variables: {
        input: {
          name: tourneyName,
          ruleset: [tourneyRuleset.id],
          date: endDate,
          players: [],
          admin: [session?.user?.id],
          maxPlayers: maxPlayers,
          invitationOnly: invitationOnly,
        },
      },
    })

    const createdTournament = result.data.createTournament
    const createdTournamentId = createdTournament.id
    const createdTournamentName = createdTournament ? createdTournament.name : 'Default Name'
    router.push(`/tourneys/editTournament?id=${createdTournamentId}&name=${createdTournamentName}`)
  }

  if (loading) return 'Submitting...'
  if (error) return alert(`Submission error! ${error.message}`)
  return (
    <div className=" p-10 rounded-lg">
      <form className="flex flex-col gap-6" onSubmit={newTourney}>
        <h2 className="text-3xl font-bold">Create a new tourney!</h2>
        <Input type="text" label="Tourney Name" placeholder="" />

        <Input className={hiddenField} type="selection" label="Ruleset Name" placeholder="" />
        <Input type="number" min="0" max="64" step="2" label="Max Players" placeholder="" />
        <Input
          type="date"
          min={new Date().toISOString().split('T')[0]}
          label="End Date"
          labelPlacement="outside-left"
          placeholder=""
        />
        <RulesView tourneyRuleset={tourneyRuleset} setTourneyRuleset={setTourneyRuleset} />
        <Checkbox>Invitation Only</Checkbox>
        <Button type="submit">Submit</Button>
      </form>
      <div className="m-20"></div>
    </div>
  )
}

export default TourneysNew
