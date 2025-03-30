'use client'

import React from 'react'
import Link from 'next/link'

const ErrorPage = () => {
  return (
    <div className="text-center  not-found-page flex">
      <div className="container">
        <h1 className="theme-gradient" style={{ fontSize: '10em' }}>
          404!
        </h1>
        <h3>
          Lost in the Clouds? That's alright, that's what we are here for! <br /> Let’s Redirect
          You!
        </h3>
        <Link className="btn-read-more mt--20" href="/">
          <span>
            Yes Please! <i className="fa fa-cloud"></i>
          </span>
        </Link>
      </div>
    </div>
  )
}

export default ErrorPage
