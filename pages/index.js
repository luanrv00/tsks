import React, {useEffect} from 'react'
import {useRouter} from 'next/router'
import Head from 'next/head'
import Layout from '../components/layout'
import {getCurrentSession} from '../utils'

export default function Index() {
  const router = useRouter()

  useEffect(() => {
    const user = getCurrentSession()

    if (!user) {
      return router.push('/signin')
    } else {
      return router.push('/tsks')
    }
  }, [])

  return (
    <Layout>
      <Head>
        <title>tsks homepage</title>
      </Head>
    </Layout>
  )
}
