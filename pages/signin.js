import React, {useState} from 'react'
import {useRouter} from 'next/router'
import Link from 'next/link'
import UserForm from '../components/user-form'
import FlashMessage from '../components/flash-message'

export default function SignIn() {
  const router = useRouter()
  const [reqError, setReqError] = useState('')

  async function handleSubmit(userCredentials) {
    const res = await fetch('http://localhost:3000/v1/login', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify(userCredentials),
    })
      .then(r => r.json())
      .catch(e => e)

    if (res.ok) {
      window.localStorage.setItem('@tsks-token', res.token)
      window.localStorage.setItem('@tsks-userId', res.user_id)
      router.push('/tsks')
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
