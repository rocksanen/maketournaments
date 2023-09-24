import React from 'react'

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Input,
  Checkbox,
} from '@nextui-org/react'

export default function App() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure()

  return (
    <>
      <Button onPress={onOpen}>Open Modal</Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} size='4xl' >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Modal Title</ModalHeader>
              <ModalBody>
                <p>Select options for your custom ruleset</p>
                <Input
                  label="Number of rounds"
                  type="number"
                  min="0"
                  max="1000"
                  placeholder="1 - 100"
                />
                <Input
                  label="Points gain for wins"
                  type="number"
                  min="0"
                  max="1000"
                  placeholder="1 - 1000"
                />

                <Input
                  label="Points loss for defeats"
                  type="number"
                  min="0"
                  max="1000"
                  placeholder="1 - 1000"
                />
                <Input
                  label="Points change from draws"
                  type="number"
                  min="0"
                  max="1000"
                  placeholder="-1000 - 1000"
                />
                <Checkbox>Nightmare mode?</Checkbox>
                <Input
                  label="Nightmare mode points change"
                  type="number"
                  min="0"
                  max="1000"
                  placeholder="1 - 1 000 000"
                />
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
                <Button color="primary" onPress={onClose}>
                  Action
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  )
}
