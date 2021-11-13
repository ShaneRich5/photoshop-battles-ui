import Layout from 'components/Layout'
import { useRouter } from 'next/dist/client/router'

const ContestDetailPage = () => {
  const router = useRouter()
  const { contestId } = router.query

  return (
    <Layout>
      <h1>Contest details: {contestId}</h1>
    </Layout>
  )
}

export default ContestDetailPage