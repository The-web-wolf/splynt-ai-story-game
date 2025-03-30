// app/page.js
'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import {
  generateStoryStep,
  interpretUserInput,
  generateConclusion,
  generateExitConfirmation,
  generateGameOpener,
} from '@/lib/model'
import { useGame } from '@/context/Context'
import {
  Progress,
  Skeleton,
  Tooltip,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from '@heroui/react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { purifyText } from '@/lib/utilities'

export default function Home() {
  const {
    gameState,
    setGameState,
    currentStepData,
    setCurrentStepData,
    userInput,
    setUserInput,
    loading,
    setLoading,
    error,
    setError,
    gameLog,
    addGameLogEntry,
    gameOver,
    setGameOver,
    gameStarted,
    setGameStarted,
    conclusion,
    setConclusion,
    resetGame,
    gameSettings,
    backLogMessages,
    addBackLogMessage,
  } = useGame()

  const router = useRouter()

  const [storyOpener, setStoryOpener] = useState('')

  useEffect(() => {
    if (storyOpener) return
    setLoading(true)
    loadStoryOpener()
  }, [])

  const loadStoryOpener = async () => {
    const storyOpenerResponse = await generateGameOpener(gameSettings)
    setStoryOpener(storyOpenerResponse)
    setLoading(false)
  }

  const { isOpen, onOpen, onOpenChange } = useDisclosure()
  const [exitConfirmation, setExitConfirmation] = useState({
    loading: false,
    title: 'You are standing up...',
    body: 'Harvey is reflecting on your interview. Please wait while we finalize the outcome.',
  })

  const fetchNextStep = async () => {
    setLoading(true)
    setError(null)
    const stepData = await generateStoryStep(gameState, gameSettings)
    if (stepData) {
      setCurrentStepData(stepData)
      addGameLogEntry({ type: 'story', text: stepData.story })
    } else {
      setError('Failed to fetch the next story step.')
      setGameOver(true)
    }
    setLoading(false)
  }

  const handleChoice = async (choiceIndex) => {
    if (!currentStepData || !currentStepData.choices || !currentStepData.choices[choiceIndex - 1]) {
      console.error('Invalid choice index')
      return
    }

    const selectedChoice = currentStepData.choices[choiceIndex - 1]
    const effect = parseInt(selectedChoice.effect, 10)

    setGameState({
      hireability: gameState.hireability + effect,
      progress: [
        ...gameState.progress,
        {
          narrator: currentStepData.story,
          player: selectedChoice.text,
        },
      ],
    })
    addBackLogMessage({ type: 'model', text: currentStepData.story })
    addBackLogMessage({ type: 'user', text: selectedChoice.text })
    addGameLogEntry({ type: 'user', text: `Chose: ${selectedChoice.text}` })
    addGameLogEntry({ type: 'effect', text: `Hireability changed by: ${effect}` })
    setCurrentStepData(null)
    setUserInput('')
  }

  const handleCustomInput = async () => {
    if (!userInput.trim()) return

    setLoading(true)
    setError(null)
    const interpretationData = await interpretUserInput(
      userInput,
      gameState,
      currentStepData ? currentStepData.story : '',
      gameSettings
    )

    if (interpretationData) {
      const effect = parseInt(interpretationData.effect, 10)
      setGameState({
        hireability: gameState.hireability + effect,
        progress: [
          ...gameState.progress,
          {
            narrator: currentStepData.story,
            player: userInput,
          },
        ],
      })
      addBackLogMessage({ type: 'model', text: currentStepData.story })
      addBackLogMessage({ type: 'user', text: userInput })
      addGameLogEntry({ type: 'user', text: `Typed: ${userInput}` })
      addGameLogEntry({
        type: 'interpretation',
        text: `Interpretation: ${interpretationData.reply}`,
      })
      addGameLogEntry({ type: 'effect', text: `Hireability changed by: ${effect}` })
      setUserInput('')
      setCurrentStepData(null)
    } else {
      setError('Failed to interpret your input.')
    }
    setLoading(false)
  }

  const fetchConclusion = async () => {
    setLoading(true)
    setError(null)
    const finalConclusion = await generateConclusion(gameState, gameSettings)
    setConclusion(finalConclusion)
    setLoading(false)
  }

  const onExitAttempt = async () => {
    onOpen()
    setExitConfirmation({
      loading: true,
      title: 'You are standing up...',
      body: 'Harvey is reflecting on your interview. Please wait while we finalize the outcome.',
    })
    const confirmationResponse = await generateExitConfirmation(gameState, gameSettings)
    setExitConfirmation((prevState) => ({
      ...confirmationResponse,
      loading: false,
    }))
  }

  const handleInputChange = (event) => {
    setUserInput(event.target.value)
  }

  const initGame = async () => {
    try {
      setLoading(true)
      setError(null)
      // update progress
      setGameState({
        progress: [
          ...gameState.progress,
          {
            narrator: storyOpener,
            player: 'Open door',
          },
        ],
      })
      setGameStarted(true)
      addBackLogMessage({ type: 'model', text: storyOpener })
      addBackLogMessage({ type: 'user', text: 'Opened the door' })
      addGameLogEntry({ type: 'story', text: 'Game started' })
    } catch (e) {
      console.log(e)
    }
  }

  const restartGame = async () => {
    if (!gameStarted) {
      return
    }
    resetGame()
    initGame()
  }

  const storyRef = useRef(null) // story container
  useEffect(() => {
    if (storyRef.current) {
      storyRef.current.scrollTo({
        top: storyRef.current.scrollHeight,
        behavior: 'smooth',
      })
    }
  }, [backLogMessages, currentStepData]) // Trigger when new text is added

  useEffect(() => {
    if (gameState.progress.length == 0) {
      return
    }
    if (!gameOver && !gameState.outcome) {
      if (gameState.progress.length + 1 >= gameSettings.difficulty.maxSteps) {
        setGameOver(true)
        setGameState({
          outcome:
            gameState.hireability > gameSettings.difficulty.hiringThreshold ? 'Hired' : 'Rejected',
        })
      } else {
        fetchNextStep()
      }
    } else {
      fetchConclusion()
    }
  }, [gameState, gameOver])

  return (
    <div className="game-container">
      {error && <p className="">Error: {error}</p>}

      <div className="game-area">
        <div className="game-header flex justify-between items-center mb-4">
          <div className="w-56">
            <Tooltip content="Home">
              <button className="btn-read-more mr-5" onClick={onExitAttempt}>
                <i className="fa-solid fa-home"></i>
              </button>
            </Tooltip>

            <Tooltip content={!gameStarted ? 'Start a new game' : 'Restart the game'}>
              <button
                className="btn-read-more"
                onClick={!gameStarted ? initGame : restartGame}
                disabled={loading}
              >
                <i className="fa-solid fa-rotate-left"></i>
              </button>
            </Tooltip>
          </div>
          <div className="text-center">
            <h2 className="text-xl font-bold">Suits Interactive Game</h2>
          </div>
          <div className="">
            <Progress
              classNames={{
                base: 'min-w-[300px] ',
                track: 'drop-shadow-lg',
                indicator: 'bg-gradient-to-r from-pink-500 to-fuchsia-500',
                label: 'tracking-wider font-medium text-default-600',
              }}
              label="Chance of getting hired"
              radius="lg"
              showValueLabel={true}
              size="md"
              value={gameState.hireability}
            />
          </div>
        </div>
        <div className="game-body">
          {gameStarted ? (
            <div
              ref={storyRef} // Attach ref to enable scrolling
              className="story overflow-y-auto max-h-[calc(100vh-450px)] "
            >
              {/* Animate older steps */}
              <AnimatePresence>
                {backLogMessages.map((message, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }} // Start hidden and below
                    animate={{ opacity: 0.7, y: 0 }} // Fade in and slide up
                    exit={{ opacity: 0, y: -10 }} // Fade out when removed
                    transition={{ duration: 0.5 }}
                    className={`mb-2 story-text ${
                      message.type === 'user'
                        ? 'text-violet-300'
                        : message.type === 'model'
                        ? ' text-violet-500'
                        : ''
                    }`}
                  >
                    <div
                      dangerouslySetInnerHTML={{
                        __html: purifyText(message.text),
                      }}
                    ></div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {/* Animate current step */}
              {currentStepData && (
                <motion.div
                  key={currentStepData.story} // Ensure animation on new text
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="mb-2 story-text"
                >
                  <div
                    dangerouslySetInnerHTML={{
                      __html: purifyText(currentStepData.story),
                    }}
                  ></div>
                </motion.div>
              )}
            </div>
          ) : (
            <motion.div
              key={storyOpener} // Ensure animation on new text
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.1 }}
              className="mb-2 story-text"
            >
              <div
                dangerouslySetInnerHTML={{
                  __html: purifyText(storyOpener),
                }}
              ></div>
            </motion.div>
          )}

          {gameOver && gameState.outcome && (
            <div className="bg-white p-4 rounded shadow mb-4">
              <p className="text-lg font-semibold mb-2">Interview Concluded!</p>
              <p className="mb-2">{conclusion}</p>
              <p className="font-bold">Outcome: {gameState.outcome}</p>
              <button
                className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-1 px-2 rounded mt-2"
                onClick={restartGame}
              >
                Play Again
              </button>
            </div>
          )}
        </div>
        <div className="game-footer">
          <AnimatePresence>
            {loading && (
              <motion.div
                key="loading"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.5, ease: 'easeInOut' }}
                className=" my-4"
              >
                <Skeleton className="h-3 w-4/5 rounded-lg custom-skeleton" />
                <Skeleton className="h-3 w-3/5 rounded-lg custom-skeleton mt-2" />
                <Skeleton className="h-3 w-2/5 rounded-lg custom-skeleton mt-2" />
              </motion.div>
            )}
          </AnimatePresence>
          <div className="choices">
            <AnimatePresence
              key="currentStepData"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.5, ease: 'easeInOut' }}
              className=" mt-4"
            >
              {!gameOver && gameState.outcome === null && currentStepData && (
                <AnimatePresence>
                  {currentStepData.choices.map((choice, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3, ease: 'easeInOut' }}
                      className="choice"
                    >
                      <a
                        className="btn-read-more text-ellipsis"
                        role="button"
                        onClick={() => handleChoice(index + 1)}
                      >
                        <span>{choice.text}</span>
                      </a>
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}
            </AnimatePresence>
            {!gameStarted && !gameOver && (
              <div className="start-game">
                <button
                  className="btn-read-more"
                  onClick={initGame}
                  disabled={loading || gameStarted}
                >
                  Open the door <i className="fa-solid fa-door-open ml-2"></i>
                </button>
              </div>
            )}
            <div className="mt-5">
              <form className="new-chat-form border-gradient">
                <Tooltip
                  content={
                    gameStarted
                      ? 'Type your response'
                      : 'After opening the door you may use this to interact'
                  }
                >
                  <input
                    placeholder="You can type a response..."
                    onChange={handleInputChange}
                    readOnly={!gameStarted}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleCustomInput()
                      }
                    }}
                  />
                </Tooltip>
                <div className="left-icons">
                  <Tooltip content="Record your response">
                    <button className="form-icon icon-mic" disabled={!gameStarted}>
                      <i className="fa-regular fa-waveform-lines"></i>
                    </button>
                  </Tooltip>
                </div>
                <div className="right-icons">
                  <Tooltip content="Send response">
                    <button
                      className="form-icon icon-send"
                      onClick={handleCustomInput}
                      type="button"
                      disabled={loading || gameOver || !gameStarted}
                    >
                      <i className="fa-sharp fa-solid fa-paper-plane-top"></i>
                    </button>
                  </Tooltip>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* <div className="mt-4 bg-white p-4 rounded shadow">
        <h2 className="font-semibold mb-2">Game Log:</h2>
        <div className="overflow-y-auto max-h-40">
          {gameLog.map((logItem, index) => (
            <p key={index} className={`mb-1 ${logItem.type === 'user' ? 'font-bold' : ''} ${logItem.type === 'effect' ? 'text-green-600' : ''} ${logItem.type === 'interpretation' ? 'italic text-gray-600' : ''}`}>
              {logItem.text}
            </p>
          ))}
        </div>
      </div> */}
      </div>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} backdrop="blur">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">{exitConfirmation.title}</ModalHeader>
              <ModalBody>{exitConfirmation.body}</ModalBody>
              <ModalFooter>
                <button onClick={onClose}>Sit back</button>
                <button
                  className="btn-read-more"
                  onClick={() => router.push('/')}
                  disabled={exitConfirmation.loading}
                >
                  {exitConfirmation.loading ? 'Wait a sec...' : "I'll Leave"}
                </button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  )
}
