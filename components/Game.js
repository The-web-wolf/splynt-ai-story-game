// app/page.js
'use client'

import { useEffect, useMemo } from 'react'
import { generateStoryStep, interpretUserInput, generateConclusion } from '@/lib/gemini'
import { useGame } from '@/context/Context'
import { Tooltip } from 'react-tooltip'
import { Progress } from '@heroui/progress'
import { Skeleton } from '@heroui/skeleton'

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
    conclusion,
    setConclusion,
    resetGame,
    playerDifficultySettings,
    setPlayerDifficultySettings,
    backLogMessages,
    addBackLogMessage,
  } = useGame()

  useEffect(() => {
    if (!gameOver && gameState.outcome === null) {
      fetchNextStep()
    } else if (gameOver && gameState.outcome) {
      fetchConclusion()
    }
  }, [gameOver, gameState.outcome])

  const fetchNextStep = async () => {
    setLoading(true)
    setError(null)
    const stepData = await generateStoryStep(gameState, playerDifficultySettings)
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
      progress: [...gameState.progress, selectedChoice.text],
    })
    addBackLogMessage({type: 'model', text: currentStepData.story})
    addBackLogMessage({type: 'user', text: selectedChoice.text})
    addGameLogEntry({ type: 'user', text: `Chose: ${selectedChoice.text}` })
    addGameLogEntry({ type: 'effect', text: `Hireability changed by: ${effect}` })
    setCurrentStepData(null)
    setUserInput('')

    if (gameState.progress.length + 1 >= playerDifficultySettings.maxSteps) {
      setGameOver(true)
      setGameState({
        outcome:
          gameState.hireability > playerDifficultySettings.hiringThreshold ? 'Hired' : 'Rejected',
      })
    } else {
      await fetchNextStep()
    }
  }

  const handleCustomInput = async () => {
    if (!userInput.trim()) return

    setLoading(true)
    setError(null)
    const interpretationData = await interpretUserInput(
      userInput,
      gameState,
      currentStepData ? currentStepData.story : '',
      playerDifficultySettings
    )

    if (interpretationData) {
      const effect = parseInt(interpretationData.effect, 10)
      setGameState({
        hireability: gameState.hireability + effect,
        progress: [...gameState.progress, userInput],
      })
      addGameLogEntry({ type: 'user', text: `Typed: ${userInput}` })
      addGameLogEntry({
        type: 'interpretation',
        text: `Interpretation: ${interpretationData.reply}`,
      })
      addGameLogEntry({ type: 'effect', text: `Hireability changed by: ${effect}` })
      setUserInput('')
      setCurrentStepData(null)

      if (gameState.progress.length + 1 >= playerDifficultySettings.maxSteps) {
        setGameOver(true)
        setGameState({
          outcome:
            gameState.hireability > playerDifficultySettings.hiringThreshold ? 'Hired' : 'Rejected',
        })
      } else {
        await fetchNextStep()
      }
    } else {
      setError('Failed to interpret your input.')
    }
    setLoading(false)
  }

  const fetchConclusion = async () => {
    setLoading(true)
    setError(null)
    const finalConclusion = await generateConclusion(gameState, playerDifficultySettings)
    setConclusion(finalConclusion)
    setLoading(false)
  }

  const handleInputChange = (event) => {
    setUserInput(event.target.value)
  }

  const isPlaying = useMemo(() => {
    return !gameOver && gameState.outcome === null
  }, [gameOver, gameState.outcome, currentStepData])

  return (
    <div className="game-container">
      {error && <p className="">Error: {error}</p>}

      <div className="game-area">
        <div className="game-header flex justify-between items-center mb-4">
          <div className="w-56">
            {isPlaying && (
              <>
                <Tooltip id="my-tooltip" className="custom-tooltip tooltip-inner" />
                <button
                  className="btn-read-more"
                  data-tooltip-id="my-tooltip"
                  data-tooltip-content="Start Over"
                  onClick={resetGame}
                  disabled={loading}
                >
                  <i className="fa-solid fa-rotate-left"></i>
                  <span className="ml-2">Start Over</span>
                </button>
              </>
            )}
          </div>
          <div className="text-center">
            <h2 className="text-2xl font-bold">Suits Interactive Game</h2>
            <p className="text-sm text-gray-500">Current Step: {gameState.progress.length}</p>
          </div>
          <div className="">
            <Progress
              classNames={{
                base: 'min-w-[250px] ',
                track: 'drop-shadow-sm border border-default',
                indicator: 'bg-gradient-to-r from-fuschia to-indigo',
                label: 'tracking-wider font-medium text-default-600',
              }}
              label="Chances of getting hired"
              radius="md"
              showValueLabel={true}
              size="lg"
              value={gameState.hireability}
            />
          </div>
        </div>
        <div className="game-body">
          {isPlaying && (
            <div className="text-2x">
              {/* older steps */}
              {backLogMessages.map((message, index) => (
                <p
                  key={index}
                  className={`mb-2 ${
                    message.type === 'user'
                      ? 'font-bold'
                      : message.type === 'model'
                      ? 'italic text-gray-600'
                      : ''
                  }`}
                >
                  {message.text}
                </p>
              ))}
              {
                currentStepData && (
                  <p className="mb-2">{currentStepData.story}</p>
                )
              }
            </div>
          )}
        </div>
        <div className="game-footer">
          <div className="choices">
            {!gameOver && gameState.outcome === null && currentStepData && (
              <>
                {currentStepData.choices.map((choice, index) => (
                  <div key={index} className="choice">
                    <a
                      className="btn-read-more"
                      role="button"
                      onClick={() => handleChoice(index + 1)}
                    >
                      <span>{choice.text}</span>
                    </a>
                  </div>
                ))}
              </>
            )}
            <div className="mt-10">
              <Tooltip id="my-tooltip" className="custom-tooltip tooltip-inner" />
              <form className="new-chat-form border-gradient">
                <textarea
                  rows="1"
                  placeholder="Type a response..."
                  onChange={handleInputChange}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleCustomInput()
                    }
                  }}
                ></textarea>
                <div className="left-icons">
                  <button
                    className="form-icon icon-mic"
                    data-tooltip-id="my-tooltip"
                    data-tooltip-content="Record response"
                  >
                    <i className="fa-regular fa-waveform-lines"></i>
                  </button>
                </div>
                <div className="right-icons">
                  <button
                    className="form-icon icon-send"
                    data-tooltip-id="my-tooltip"
                    data-tooltip-content="Send response"
                    onClick={handleCustomInput}
                    type="button"
                    disabled={
                      loading || (!gameOver && gameState.outcome === null && currentStepData)
                    }
                  >
                    <i className="fa-sharp fa-solid fa-paper-plane-top"></i>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
        {/* {gameOver && gameState.outcome && (
          <div className="bg-white p-4 rounded shadow mb-4">
            <p className="text-lg font-semibold mb-2">Interview Concluded!</p>
            <p className="mb-2">{conclusion}</p>
            <p className="font-bold">Outcome: {gameState.outcome}</p>
            <button
              className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-1 px-2 rounded mt-2"
              onClick={resetGame}
            >
              Play Again
            </button>
          </div>
        )} */}

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
    </div>
  )
}
