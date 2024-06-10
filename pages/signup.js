import React, {useState} from 'react'
import {useRouter} from 'next/router'
import Link from 'next/link'
import {Layout, UserForm, FlashMessage, SpacerSmall, Subtitle} from '../components'
import {setCurrentUserAtBrowser, setCurrentAuthTokenAtBrowser} from '../utils'
import {signUpUser} from '../services'

export default function SignUp() {
  const router = useRouter()
  const [reqError, setReqError] = useState('')

  async function handleSubmit({email, password}) {
    const {ok, data, error} = await signUpUser({email, password})

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
      <Subtitle value='signup' />
      <UserForm handleSubmit={handleSubmit} />
      <SpacerSmall/>
      <Link href='/signin'>or signin to your account</Link>
    </Layout>
  )
}
