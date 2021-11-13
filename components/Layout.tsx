import Head from "next/head"

const Layout: React.FC = ({ children }) => {
  return (
    <div>
      <Head>
        <title key="title">Photoshop Battles</title>
        <link key="favicon" rel="icon" href="/favicon.ico" />
      </Head>
      {children}
    </div>
  )
}

export default Layout