'use client'

import Shapes from '@/components/Shapes'
import { Select, SelectItem, Avatar } from '@heroui/react'
import { useEffect, useState } from 'react'
import { useGame, defaultGameSettings } from '@/context/Context'
import { LANGUAGES, DIFFICULTY_LEVELS } from '@/lib/constants'

import { useRouter } from 'next/navigation'

const HomePage = () => {
  const { gameSettings, setGameSettings } = useGame()

  const [selectedLanguage, setSelectedLanguage] = useState(gameSettings.language)
  const [selectedDifficulty, setSelectedDifficulty] = useState(gameSettings.difficulty.key)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const startGame = (e) => {
    setLoading(true)
    e.preventDefault()
    const difficultySettings =
      DIFFICULTY_LEVELS.find((level) => level.key === selectedDifficulty.key) ||
      defaultGameSettings.difficulty
    setGameSettings({
      language: selectedLanguage,
      default: false,
      difficulty: difficultySettings,
    })
  }

  useEffect(() => {
    console.log(gameSettings)
    if (gameSettings.default !== true) {
      setTimeout(() => {
        router.push('/game')
        setLoading(false)
      }, 2000)
    }
  }, [gameSettings])

  useEffect(() => {
    setGameSettings((prevSettings) => ({
      ...prevSettings,
      default: true,
    }))
  }, [])

  return (
    <div className="inner text-center">
      <div>
        <h1 className="title display-one text-balance font-bold">
          AI-Powered Interactive
          <span className="header-caption theme-gradient ">Interactive</span> Story Game
        </h1>
        <p className="description ">
          Experience a unique, ever-evolving story where your choices guide the narrative, powered
          by real-time AI without predefined scripts.
        </p>
      </div>
      <form className="w-full" onSubmit={startGame}>
        <div className=" flex gap-10 justify-center ">
          <Select
            className=" flex-1 max-w-60"
            label="Choose difficulty"
            color="info"
            size="lg"
            selectedKeys={[selectedDifficulty]}
            onChange={(e) => setSelectedDifficulty(e.target.value)}
          >
            {DIFFICULTY_LEVELS.map((level) => (
              <SelectItem
                key={level.key}
                endContent={<i className={`fa-solid fa-${level.icon} text-2xl`}></i>}
              >
                {level.label}
              </SelectItem>
            ))}
          </Select>
          <Select
            className=" flex-1 max-w-60"
            label="Choose language"
            color="default"
            size="lg"
            selectedKeys={[selectedLanguage]}
            onChange={(e) => setSelectedLanguage(e.target.value)}
          >
            {LANGUAGES.map((lang) => (
              <SelectItem
                key={lang.key}
                endContent={<Avatar alt={lang.label} className="w-6 h-6" src={lang.flag} />}
              >
                {lang.label}
              </SelectItem>
            ))}
          </Select>
        </div>
        <div className="mt-20">
          <button
            className="btn-read-more p-6"
            type="submit"
            disabled={loading}
          >
            <span>
              Begin Game{' '}
              <i
                className={`fa-regular ms-3 ${
                  loading ? 'fa-yin-yang fa-spin ' : 'fa-gamepad-modern'
                }`}
              ></i>
            </span>
          </button>
        </div>
      </form>
      <Shapes />
    </div>
  )
}

export default HomePage
