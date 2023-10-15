import React from 'react'
import { Card, CardHeader, Input, Dropdown, DropdownItem, Button } from '@nextui-org/react'

interface InviteCardProps {
  email: string
  setEmail: (email: string) => void
  handleSendBoth: () => void
}

const InvitationCard: React.FC<InviteCardProps> = ({ email, setEmail, handleSendBoth }) => {
  return (
    <Card className="w-full h-1/4 flex flex-col gap-1 items-start justify-center">
      <CardHeader className="flex items-center justify-between w-full">
        <Input
          type="text"
          label="Invite player"
          placeholder="Enter email address"
          className="w-full"
          labelPlacement="outside-left"
          style={{ marginRight: '1rem' }}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Dropdown placeholder="Select role" className="w-1/4">
          <DropdownItem value="player">Player</DropdownItem>
          <DropdownItem value="admin">Admin</DropdownItem>
        </Dropdown>
        <Button color="primary" className="w-20 h-full" onClick={handleSendBoth}>
          Send
        </Button>
      </CardHeader>
    </Card>
  )
}

export default InvitationCard
