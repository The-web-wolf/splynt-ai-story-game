import { useGame } from '@/context/Context'
import {
  Tooltip,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from '@heroui/react'

import { useEffect } from 'react'

const LogsButton = () => {
  const { gameLog } = useGame()
  const { isOpen, onOpen, onOpenChange } = useDisclosure()

  useEffect(() => {
    console.log(gameLog)
  }, [gameLog])

  const logClassNames = (entry) => {
    switch (entry.type) {
      case 'user':
        return 'bold text-white font-semibold text-violet-800';
      case 'model':
        return 'text-cyan-400';
      case 'story':
        return 'text-neutral-500';
      case 'interpretation':
        return 'bg-sky-800 rounded-md p-2 font-light';
      case 'effect':
        return 'font-black';
      default:
        return 'log-default'; 
    }
  };

  return (
    <>
      <Tooltip content="View Game Logs">
        <button className="btn-read-more mr-5" onClick={onOpen}>
          <i className="fa-light fa-circle-exclamation"></i>
        </button>
      </Tooltip>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} backdrop="blur" size="5xl" scrollBehavior='inside'>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Game Log</ModalHeader>
              <ModalBody>
                {gameLog.map((logItem, index) => (
                  <div
                    key={index}
                    className={logClassNames(logItem)}
                  >
                    {logItem.text}
                  </div>
                ))}
              </ModalBody>
              <ModalFooter>
                <button onClick={onClose} className="btn-read-more">
                  Close
                </button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  )
}

export default LogsButton
