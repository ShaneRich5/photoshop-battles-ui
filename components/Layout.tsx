import React from 'react'
import Head from 'next/head'

const Layout: React.FC = ({ children }) => {
  return (
    <React.Fragment>
      <Head>
        <title key="title">Photoshop Battles</title>
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" key="apple-touch-icon"/>
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" key="icon-32"/>
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" key="icon-16"/>
        <link rel="manifest" href="/site.webmanifest" key="manifest"/>
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5" key="mask-icon"/>
        <meta name="msapplication-TileColor" content="#da532c" key="ms-tile-color"/>
        <meta name="theme-color" content="#ffffff" key="theme-color"/>
      </Head>
      <div className="pb-6">
        {children}
      </div>
    </React.Fragment>
  )
}

export default Layout