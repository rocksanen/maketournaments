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
import CustomRules from '@/components/custom-rules'

/* based on interface CreateTournamentArgs {
    input: {
        name: string;
        rules: Rules[];
        date: string;
        players?: User[];
        admin: User[];
        matches?: Match[];
    
*/

// query ruleids

function TourneysNew() {
  const [selectedKeys, setSelectedKeys] = React.useState(new Set(['Select Ruleset']))
  const [evenPlayers, setEvenPlayers] = useState(true)

  const [hiddenField, setHiddenField] = useState('hidden')
  const { data: session } = useSession()

  const newTourney = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const tourneyName = (form[0] as HTMLInputElement).value
    const tourneyDesc = (form[1] as HTMLInputElement).value
    const maxPlayers = (form[4] as HTMLInputElement).value

    const endDate = (form[5] as HTMLInputElement).value
    const invitationOnly = (form[6] as HTMLInputElement).checked
    let ruleset = 'default'
    if (selectedKeys.has('Custom')) {
      ruleset = (form[3] as HTMLInputElement).value
    }
    if (!selectedKeys.has('Custom')) {
      ruleset = selectedKeys.values().next().value
    }
    console.log('ruleset', ruleset)
    console.log('evenplayers', evenPlayers)
    console.log('maxplayers', maxPlayers)
    console.log('tourneyname', tourneyName)
    console.log('tourneydesc', tourneyDesc)
    console.log('enddate', endDate)
    console.log('invitationonly', invitationOnly)
  }

  const chooseGameMode = React.useMemo(() => {
    console.log(selectedKeys)
    // if selectedkeys has value custom, then make an alert
    if (selectedKeys.has('Custom')) {
      setHiddenField('visible')
    }
    if (!selectedKeys.has('Custom')) {
      setHiddenField('hidden')
    }
    if (selectedKeys.has('Series (noneven)')) {
      setEvenPlayers(false)
    } else {
      setEvenPlayers(true)
    }
    console.log('evenpolayers', evenPlayers)
    return selectedKeys
  }, [selectedKeys, evenPlayers])

  return (
    <div className="bg-amber-800 p-10 rounded-lg">
      <form className="flex flex-col gap-6" onSubmit={newTourney}>
        <h2 className="text-3xl font-bold">Create a new tourney!</h2>
        <Input type="text" label="Tourney Name" placeholder="" />
        <Input type="text" label="Give a catchy decription!" placeholder="" />
        <Dropdown>
          <DropdownTrigger>
            <Button className="capitalize">{chooseGameMode}</Button>
          </DropdownTrigger>
          <DropdownMenu
            aria-label="Ruleset"
            variant="flat"
            disallowEmptySelection
            selectionMode="single"
            selectedKeys={selectedKeys}
            onSelectionChange={setSelectedKeys}
          >
            <DropdownItem key="A (even)">Mode A (even)</DropdownItem>
            <DropdownItem key="B (even)">Mode B (even)</DropdownItem>
            <DropdownItem key="C (even)">Mode C (even)</DropdownItem>
            <DropdownItem key="Series (noneven)">Series (noneven)</DropdownItem>
            <DropdownItem key="Custom">Custom Mode</DropdownItem>
          </DropdownMenu>
        </Dropdown>

        <Input className={hiddenField} type="selection" label="Ruleset Name" placeholder="" />
        <div className={hiddenField}>
          <CustomRules></CustomRules>
        </div>
        <Input
          type="number"
          min="0"
          max="64"
          step={evenPlayers ? 2 : 1}
          label="Max Players"
          placeholder=""
        />
        <Input
          type="date"
          min={new Date().toISOString().split('T')[0]}
          label="End Date"
          labelPlacement="outside-left"
          placeholder=""
        />
        <Checkbox>Invitation Only</Checkbox>
        <Button type="submit">Submit</Button>
      </form>
    </div>
  )
}

export default TourneysNew
