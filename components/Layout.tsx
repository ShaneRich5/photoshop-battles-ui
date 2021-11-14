import React from 'react'
import Head from 'next/head'

const Layout: React.FC = ({ children }) => {
  return (
    <React.Fragment>
      <Head>
        <title key="title">Photoshop Battles</title>
      </Head>
      {children}
    </React.Fragment>
  )
}

export default Layout