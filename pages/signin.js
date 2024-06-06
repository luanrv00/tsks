import React, {useState} from 'react'
import {useRouter} from 'next/router'
import Link from 'next/link'
import {Layout, UserForm, FlashMessage, SpacerSmall, Subtitle} from '../components'
import {setCurrentUserAtBrowser, setCurrentAuthTokenAtBrowser} from '../utils'

const API_URL = process.env.NEXT_PUBLIC_API_URL

export default function SignIn() {
  const router = useRouter()
  const [reqError, setReqError] = useState('')

  async function handleSubmit(userCredentials) {
    const res = await fetch(`${API_URL}/signin`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify(userCredentials),
      credentials: 'include'
    })
      .then(r => r.json())
      .catch(e => e)

    if (res.ok) {
      setCurrentUserAtBrowser(res.user)
      setCurrentAuthTokenAtBrowser(res.auth_token)
      return router.push('/tsks')
    } else {
      setReqError(res.message)
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
