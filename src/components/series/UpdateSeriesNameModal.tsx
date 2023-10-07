import React from 'react'
import { useMutation } from '@apollo/client'
import { Series } from '@/types/Series'
import { Modal, ModalContent, ModalHeader, ModalBody, Button, Input } from '@nextui-org/react'
import { useSession } from 'next-auth/react'
import {
  FETCH_SERIES,
  GET_TOURNAMENTS_BY_SERIES,
  UPDATE_SERIES_NAME,
} from '@/graphql/clientQueries/seriesOperations'
interface Props {
  selectedSeries: Series | null
  isOpen: boolean
  onClose: () => void
  onUpdate: () => void
}

const UpdateSeriesNameModal = ({ selectedSeries, isOpen, onClose, onUpdate }: Props) => {
  const [updateSeriesName] = useMutation(UPDATE_SERIES_NAME)
  const [newSeriesName, setNewSeriesName] = React.useState<string>('')

  const { data: session } = useSession()

  const handleUpdateSeriesName = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {
      const response = await updateSeriesName({
        variables: {
          seriesId: selectedSeries?.id,
          name: newSeriesName,
        },
        refetchQueries: [
          { query: FETCH_SERIES, variables: { adminId: session?.user.id } },
          { query: GET_TOURNAMENTS_BY_SERIES, variables: { seriesId: selectedSeries?.id } },
        ],
      })
      const result = response.data.updateSeriesName.success
      if (result === true) {
        alert('Series name changed successfully')
        onUpdate()
      } else {
        alert(response.data.updateSeriesName.message)
      }
    } catch (error) {
      alert('Error updating series name, please try again later')
      console.log(error)
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalContent>
        <ModalHeader>Update Name For {selectedSeries?.name}</ModalHeader>
        <ModalBody>
          <form onSubmit={handleUpdateSeriesName}>
            <Input
              value={newSeriesName}
              onChange={(e) => setNewSeriesName(e.target.value)}
              placeholder="Enter new name"
              required
              minLength={3}
            />
            <div className="flex justify-end gap-2">
              <Button type="submit" color="primary" onClick={onClose}>
                Save
              </Button>
              <Button type="button" color="danger" onClick={onClose}>
                Cancel
              </Button>
            </div>
          </form>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}

export default UpdateSeriesNameModal
