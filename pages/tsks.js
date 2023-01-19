import React, {useState, useEffect} from 'react'
import {useRouter} from 'next/router'
import TsksList from '../components/tsks-list'
import {getCurrentUser} from '../utils'

const NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL

export default function Tsks() {
  const router = useRouter()
  const [tsks, setTsks] = useState({})
  const [fallbackMsg, setFallbackMsg] = useState('No tsks found')

  useEffect(async () => {
    const user = getCurrentUser()

    if (!user) {
      return router.push('/signin')
    }

    const apiToken = user.auth_token

    try {
      // TODO: move fetching data to a separate service
      await fetch(`${NEXT_PUBLIC_API_URL}/tsks`, {
        headers: {
          authorization: `Bearer ${apiToken}`,
          'Access-Control-Allow-Origin': '*',
        },
      })
        .then(res => res.json())
        .then(res => {
          if (!res.ok) {
            return setFallbackMsg(res.msg)
          } else if (res.tsks.length && !res.error) {
            return setTsks(res.tsks)
          }
        })
        .catch(e => setFallbackMsg(e.toString()))
    } catch (e) {
      handleError(e)
    }
  }, [])

  return (
    <div className='tsks'>
      {Boolean(Object.keys(tsks).length) ? (
        <TsksList tsksData={tsks} />
      ) : (
        <p>{fallbackMsg}</p>
      )}
    </div>
  )
}
