import React, {useState} from 'react'
import {useRouter} from 'next/router'
import Link from 'next/link'
import {Layout, UserForm, FlashMessage, SpacerSmall} from '../components'
import {setCurrentUserAtBrowser} from '../utils'

export default function SignIn() {
  const router = useRouter()
  const [reqError, setReqError] = useState('')

  async function handleSubmit(userCredentials) {
    const res = await fetch('https://tsks-api.onrender.com/v1/signin', {
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
      return router.push('/tsks')
    } else {
      setReqError(res.message)
    }
  }

  return (
    <Layout>
      <FlashMessage type='error' message={reqError} />
      <UserForm handleSubmit={handleSubmit} />
      <SpacerSmall />
      <Link href='/signup'>or signup a new account</Link>
    </Layout>
  )
}
