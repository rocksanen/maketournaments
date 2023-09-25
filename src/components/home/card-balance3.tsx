import { Card, CardBody } from '@nextui-org/react'
import React from 'react'
import { Community } from '../icons/community'

export const CardBalance3 = () => {
  return (
    <Card className="xl:max-w-sm bg-success rounded-xl shadow-md px-3 w-full">
      <CardBody className="py-5">
        <div className="flex gap-2.5">
          <Community />
          <div className="flex flex-col">
            <span className="text-white">Average Series finish</span>
            <span className="text-white text-xs">6 series</span>
          </div>
        </div>
        <div className="flex gap-2.5 py-2 items-center">
          <span className="text-white text-xl font-semibold">1.35</span>
        </div>
      </CardBody>
    </Card>
  )
}
