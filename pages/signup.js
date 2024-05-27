import React, {useState} from 'react'
import {useRouter} from 'next/router'
import Link from 'next/link'
import {Layout, UserForm, FlashMessage, SpacerSmall} from '../components'
import {setCurrentUserAtBrowser, setCurrentAuthTokenAtBrowser} from '../utils'

const API_URL = process.env.NEXT_PUBLIC_API_URL

export default function SignUp() {
  const router = useRouter()
  const [reqError, setReqError] = useState('')

  async function handleSubmit(userCredentials) {
    const res = await fetch(`${API_URL}/signup`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify(userCredentials),
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
      <UserForm handleSubmit={handleSubmit} />
      <SpacerSmall/>
      <Link href='/signin'>or signin to your account</Link>
    </Layout>
  )
}
