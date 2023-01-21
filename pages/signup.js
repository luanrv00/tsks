import React, {useState} from 'react'
import {useRouter} from 'next/router'
import {Layout, UserForm, FlashMessage} from '../components'
import {setCurrentUser} from '../utils'

const {NEXT_PUBLIC_API_URL} = process.env

export default function SignUp() {
  const router = useRouter()
  const [reqError, setReqError] = useState('')

  async function handleSubmit(userCredentials) {
    const res = await fetch(`${NEXT_PUBLIC_API_URL}/signup`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify(userCredentials),
    })
      .then(r => r.json())
      .catch(e => e)

    if (res.ok) {
      setCurrentUser(res.user)
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
