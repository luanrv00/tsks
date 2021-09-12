import React, {useEffect} from 'react'
import {useRouter} from 'next/router'
import Head from 'next/head'
import Layout from '../components/layout'

export default function Index() {
  const router = useRouter()

  useEffect(() => {
    const userInfo = JSON.parse(window.localStorage.getItem('@tsks-user'))

    if (!userInfo) {
      router.push('/signup')
    } else if (userInfo.id != undefined) {
      router.push('/tsks')
    }
  }, [])

  return (
    <Layout>
      <Head>
        <title>tsks</title>
      </Head>
    </Layout>
  )
}
