'use client'
import React from 'react'
import { Input, Checkbox } from '@nextui-org/react'

function TourneysNew() {
  return (
    <div>
      <form>
        <Input type="text" placeholder="Tourney Name" />
        <Input type="selection" placeholder="Game Mode" />
        <Input type="date" placeholder="End Date" />
        <Input type="number" placeholder="Max Players" />
        <Checkbox>Invitation Only</Checkbox>
      </form>
    </div>
  )
}

export default TourneysNew
