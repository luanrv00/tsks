import React, {useEffect} from 'react'
import {useRouter} from 'next/router'
import Head from 'next/head'
import Layout from '../components/layout'

export default function Index() {
  const router = useRouter()

  useEffect(() => {
    const hasSession = window.localStorage.getItem('@tsks-user')

    if (!hasSession) {
      router.push('/signin')
    } else {
      router.push('/tsks')
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
