import React, {useEffect} from 'react'
import {useRouter} from 'next/router'
import Head from 'next/head'
import {Layout} from '../components'
import {getCurrentUserAtBrowser} from '../utils'

export default function Index() {
  const router = useRouter()

  useEffect(() => {
    const user = getCurrentUserAtBrowser()
    if (!user) return router.push('/signin')
    return router.push('/tsks')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Layout>
      <Head>
        <title>tsks homepage</title>
      </Head>
    </Layout>
  )
}
