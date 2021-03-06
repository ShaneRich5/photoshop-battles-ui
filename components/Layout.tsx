import React from 'react'
import Head from 'next/head'
import PageContainer from './PageContainer'
import PageTitle from './PageTitle'
import PageHeader from './PageHeader'
import Link from 'next/link'

const Layout: React.FC = ({ children }) => {
  return (
    <React.Fragment>
      <Head>
        <title key="title">Photoshop Battles</title>
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" key="apple-touch-icon"/>
        <link rel="icon" href="/favicon.ico" key="favicon"/>
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" key="favicon-32"/>
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" key="favicon-16"/>
        <link rel="manifest" href="/site.webmanifest" key="manifest"/>
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5" key="mask-icon"/>
        <meta name="msapplication-TileColor" content="#da532c" key="ms-tile-color"/>
        <meta name="theme-color" content="#ffffff" key="theme-color"/>
        <script async data-api="/_hive" src="/bee.js"></script>
      </Head>
      <div className="pb-6">
        {children}
      </div>
    </React.Fragment>
  )
}

export default Layout