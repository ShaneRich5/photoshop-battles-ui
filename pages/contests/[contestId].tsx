import Layout from 'components/Layout'
import { useRouter } from 'next/dist/client/router'

const ContestDetailPage = () => {
  const router = useRouter()
  const { contestId } = router.query

  return (
    <Layout>
      <div className="container mx-auto sm:px-6 lg:px-8">
        <h1>Contest details: {contestId}</h1>
      </div>
    </Layout>
  )
}

export default ContestDetailPage