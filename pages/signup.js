import React, {useState} from 'react'
import {useRouter} from 'next/router'
import UserForm from '../components/user-form'
import FlashMessage from '../components/flash-message'

const NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL

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
      window.localStorage.setItem('@tsks-user', JSON.stringify(res.user))
      router.push('/tsks')
    } else {
      setReqError(res.message)
    }
  }

  return (
    <>
      <FlashMessage type='error' message={reqError} />
      <UserForm handleSubmit={handleSubmit} />
    </>
  )
}
