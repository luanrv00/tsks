import React, {useState} from 'react'
import {useRouter} from 'next/router'
import {Layout, UserForm, FlashMessage} from '../components'
import {setCurrentUserAtBrowser} from '../utils'

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
      return router.push('/tsks')
    } else {
      setReqError(res.message)
    }
  }

  return (
    <Layout>
      <FlashMessage type='error' message={reqError} />
      <UserForm handleSubmit={handleSubmit} />
    </Layout>
  )
}
