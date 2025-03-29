'use client'

import React, { useEffect } from 'react'
import { Sora } from 'next/font/google'

import { GameProvider } from '@/context/Context'
import { HeroUIProvider } from '@heroui/react'
import { ThemeProvider as NextThemesProvider } from 'next-themes'

import BackToTop from '@/app/backToTop'

// import 'bootstrap/dist/css/bootstrap.min.css'
import '@/public/css/plugins/fontawesome-all.min.css'

import '@/public/scss/style.scss'
import '@/app/globals.css'

import Image from 'next/image'

import bgShapeOne from '@/public/images/bg/bg-shape-four.png'
import bgShapeTwo from '@/public/images/bg/bg-shape-five.png'

const sora = Sora({
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800'],
})

export default function RootLayout({ children }) {
  useEffect(() => {
    // Bootstrap JavaScript is now imported via CSS import above
    // If you still need specific Bootstrap JS functionality, you can import it here selectively
    // require('bootstrap/dist/js/bootstrap.bundle.min.js');
  }, [])

  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Suits Interview Game</title>
      </head>
      <body className={sora.className} suppressHydrationWarning={true}>
        <main className="page-wrapper">
          <GameProvider>
            <section className="layout-fullscreen">
              <div className="animated-gradient-bg">
                <svg xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <filter id="goo">
                      <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
                      <feColorMatrix
                        in="blur"
                        mode="matrix"
                        values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -8"
                        result="goo"
                      />
                      <feBlend in="SourceGraphic" in2="goo" />
                    </filter>
                  </defs>
                </svg>
                <div className="gradients-container">
                  <div className="g1"></div>
                  <div className="g2"></div>
                  <div className="g3"></div>
                  <div className="g4"></div>
                  <div className="g5"></div>
                  <div className="interactive"></div>
                </div>
              </div>
              <div
                className="slider-area variation-default slider-bg-image bg-banner1 slider-bg-shape full-page"
                data-black-overlay="1"
              >
                <div className="container">
                  <div className="row justify-content-center">
                    <div className="col-lg-12">
                      <HeroUIProvider>
                        <NextThemesProvider attribute="class" defaultTheme="dark">
                          {children}
                        </NextThemesProvider>
                      </HeroUIProvider>
                    </div>
                  </div>
                </div>
                <div className="bg-shape">
                  <Image
                    className="bg-shape-one"
                    width={640}
                    height={949}
                    src={bgShapeOne}
                    alt="Bg Shape"
                  />
                  <Image
                    className="bg-shape-two"
                    src={bgShapeTwo}
                    width={626}
                    height={1004}
                    alt="Bg Shape"
                  />
                </div>
              </div>
            </section>
            <BackToTop />
          </GameProvider>
        </main>
      </body>
    </html>
  )
}
