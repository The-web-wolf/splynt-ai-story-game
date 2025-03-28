'use client'

import Shapes from '@/components/Shapes'

const HomePage = () => {
  return (
    <div className="inner text-center mt--140">
        <h1 className="title display-one text-balance">
          AI-Powered Interactive
          <span className="header-caption theme-gradient">Interactive</span> Story Game
        </h1>
        <p className="description">
          Experience a unique, ever-evolving story where your choices guide the narrative, powered
          by real-time AI without predefined scripts.
        </p>
        <div className="banner-button">
          <a
            className="rainbow-gradient-btn without-shape-circle btn-large has-shadow"
            href="/game"
          >
            <span>
              Begin Game <i className="fa-regular fa-gamepad-modern ms-3"></i>
            </span>
          </a>
        </div>
        <Shapes />
    </div>
  )
}

export default HomePage
