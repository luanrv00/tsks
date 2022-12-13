import React, {useState, useEffect} from 'react'
import {useRouter} from 'next/dist/client/router'
import TsksList from '../components/tsks-list'

const NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL
const NEXT_PUBLIC_API_TOKEN = process.env.NEXT_PUBLIC_API_TOKEN

export default function Tsks() {
  const router = useRouter()
  const [tsks, setTsks] = useState({})
  const [fallbackMsg, setFallbackMsg] = useState('No tsks found')

  const handleError = e => {
    setFallbackMsg(e.toString())
  }

  useEffect(() => {
    const userId = window.localStorage.getItem('@tsks-userId')

    if (!userId) {
      router.push('/signin')
    }
  }, [])

  useEffect(async () => {
    const apiToken = window.localStorage.getItem('@tsks-token')

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
        .catch(e => handleError(e))
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
