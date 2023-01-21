import React, {useEffect} from 'react'
import {useRouter} from 'next/router'
import Head from 'next/head'
import {Layout} from '../components'
import {getCurrentUser} from '../utils'

export default function Index() {
  const router = useRouter()

  useEffect(() => {
    const user = getCurrentUser()

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
