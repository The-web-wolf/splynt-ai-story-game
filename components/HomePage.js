'use client'

import Shapes from '@/components/Shapes'
import { Select, SelectItem, Avatar } from '@heroui/react'
import { useState } from 'react'
import { useGame } from '@/context/Context'
import { LANGUAGES, DIFFICULTY_LEVELS } from '@/lib/constants'

const HomePage = () => {

  const { gameSettings, setGameLanguage, setGameDifficulty } = useGame()

  const [selectedLanguage, setSelectedLanguage] = useState(gameSettings.language)
  const [selectedDifficulty, setSelectedDifficulty] = useState(gameSettings.difficulty.key)

  const startGame = (e) => {
    e.preventDefault()
    setGameLanguage(selectedLanguage)
    setGameDifficulty(selectedDifficulty)
    window.location.href = '/game'
  }

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
                endContent={
                  <i
                    className={`fa-solid fa-${level.icon} text-2xl`}
                  ></i>
                }
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
        <div className="mt-10">
          <button
            className="rainbow-gradient-btn without-shape-circle btn-large has-shadow"
            type="submit"
          >
            <span>
              Begin Game <i className="fa-regular fa-gamepad-modern ms-3"></i>
            </span>
          </button>
        </div>
      </form>
      <Shapes />
    </div>
  )
}

export default HomePage
