'use client'
import RulesView from '@/components/createTourney/rules-view'
import { HouseIcon } from '@/components/icons/breadcrumb/house-icon'
import { RulesetOutput } from '@/types/Ruleset'
import { gql, useMutation } from '@apollo/client'
import { Button, Card, CardBody, Checkbox, Input, Link } from '@nextui-org/react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import React, { useState } from 'react'
import { CREATE_TOURNAMENT } from '@/graphql/clientQueries/tournamentOperations'
import { customRule } from '@/utils/customRules'

function TourneysNew() {
  const [tourneyRuleset, setTourneyRuleset] = useState<RulesetOutput>(customRule)

  const [mutateFunction, { data, loading, error }] = useMutation(CREATE_TOURNAMENT)
  const { data: session } = useSession()
  const router = useRouter()

  const newTourney = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const tourneyName = (form[0] as HTMLInputElement).value
    const maxPlayers = parseInt((form[1] as HTMLInputElement).value)

    const endDate = (form[2] as HTMLInputElement).value
    const invitationOnly = (form[3] as HTMLInputElement).checked

    if (!session?.user?.id) {
      alert('Please log in to create a tournament')
      return
    }

    if (!tourneyName || !maxPlayers || !endDate || !tourneyRuleset.id) {
      alert('Please fill out all fields')
      return
    }
    if (tourneyRuleset.id == 'custom') {
      alert('Please select a ruleset')
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

  if (loading) return <div>Submitting...</div>
  if (error) {
    alert(`Submission error! ${error.message}`)
    return <div>Error occurred!</div>
  }

  return (
    <div>
      <div className="my-14 max-w-[95rem] mx-auto w-full flex flex-col gap-4">
        <ul className="flex">
          <li className="flex gap-2">
            <HouseIcon />
            <Link href={'/'}>
              <span>Home</span>
            </Link>
            <span> / </span>
          </li>
        </ul>
        <h3 className="text-xl font-semibold">Add New Tournament</h3>
        <Card className="sm:w-1/2 md:w-1/2 lg:w-1/3 flex flex-col gap-4">
          <CardBody>
            <form className="flex flex-col gap-6" onSubmit={newTourney}>
              <Input type="text" label="Tourney Name" placeholder="" />

              <Input type="number" min="0" max="64" step="2" label="Max Players" placeholder="" />
              <Input
                type="date"
                min={new Date().toISOString().split('T')[0]}
                label="End Date"
                labelPlacement="outside-left"
                placeholder=""
              />
              <Checkbox className="hidden" defaultSelected>
                Invitation Only
              </Checkbox>
              <RulesView tourneyRuleset={tourneyRuleset} setTourneyRuleset={setTourneyRuleset} />
              <Button color="primary" type="submit">
                Create Tournament
              </Button>
            </form>

            <div className="mb-10"></div>
          </CardBody>
        </Card>
      </div>
    </div>
  )
}

export default TourneysNew
