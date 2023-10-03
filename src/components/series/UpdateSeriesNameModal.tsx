import React from 'react'
import { gql, useMutation } from '@apollo/client'
import { Series } from '@/types/Series'
import { Modal, ModalContent, ModalHeader, ModalBody, Button, Input } from '@nextui-org/react'
interface Props {
  selectedSeries: Series | null
  isOpen: boolean
  onClose: () => void
}

const UPDATE_SERIES_NAME = gql`
  mutation updateSeriesName($seriesId: ID!, $name: String!) {
    updateSeriesName(seriesId: $seriesId, name: $name) {
      success
      message
    }
  }
`

const UpdateSeriesNameModal: React.FC<Props> = ({ selectedSeries, isOpen, onClose }) => {
  const [updateSeriesName] = useMutation(UPDATE_SERIES_NAME)
  const [newSeriesName, setNewSeriesName] = React.useState<string>('')

  const handleUpdateSeriesName = async () => {
    try {
      await updateSeriesName({
        variables: {
          seriesId: selectedSeries?.id,
          name: newSeriesName,
        },
      })
    } catch (error) {
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
              <Button type="submit" color="primary">
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
