'use client'
import React from 'react'
import {Link} from "@nextui-org/react";

function Tourneys() {
  return (
    <div className='flex flex-col'>
      <Link href="/tourneys/new">New Tourney</Link>
      <Link href="/tourneys/join/1">Join Tourney</Link>
    </div>
  )
}

export default Tourneys