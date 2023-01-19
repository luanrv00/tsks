import React, {useState} from 'react'
import {useRouter} from 'next/router'
import Link from 'next/link'
import UserForm from '../components/user-form'
import FlashMessage from '../components/flash-message'
import {setCurrentUser} from '../utils'

const NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL

export default function SignIn() {
  const router = useRouter()
  const [reqError, setReqError] = useState('')

  async function handleSubmit(userCredentials) {
    const res = await fetch(`${NEXT_PUBLIC_API_URL}/signin`, {
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
    <>
      <FlashMessage type='error' message={reqError} />
      <UserForm handleSubmit={handleSubmit} />
      <Link href='/signup'>or signup a new account</Link>
    </>
  )
}
