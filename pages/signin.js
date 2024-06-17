import React, {useState} from 'react'
import {useRouter} from 'next/router'
import Link from 'next/link'
import {
  Layout,
  UserForm,
  FlashMessage,
  SpacerSmall,
  Subtitle,
} from '../components'
import {setCurrentUserAtBrowser, setCurrentAuthTokenAtBrowser} from '../utils'
import {signInUser} from '../services'

const API_URL = process.env.NEXT_PUBLIC_API_URL

export default function SignIn() {
  const router = useRouter()
  const [reqError, setReqError] = useState('')

  async function handleSubmit({email, password}) {
    const {ok, data, error} = await signInUser({email, password})

    if (ok) {
      setCurrentUserAtBrowser(data.user)
      setCurrentAuthTokenAtBrowser(data.auth_token)
      return router.push('/tsks')
    } else {
      setReqError(error.message)
    }
  }

  return (
    <Layout>
      <FlashMessage type='error' message={reqError} />
      <Subtitle value='signin' />
      <UserForm handleSubmit={handleSubmit} />
      <SpacerSmall />
      <Link href='/signup'>or signup a new account</Link>
    </Layout>
  )
}
