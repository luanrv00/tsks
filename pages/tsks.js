import React, {useState, useEffect} from 'react'
import {useRouter} from 'next/router'
import {Layout, FlashMessage, TsksList, TskForm} from '../components'
import {getCurrentUserAtBrowser} from '../utils'

const API_URL = process.env.NEXT_PUBLIC_API_URL

export default function Tsks() {
  const router = useRouter()
  const [tsks, setTsks] = useState({})
  const [fallbackMsg, setFallbackMsg] = useState('tsks not found')
  const [reqError, setReqError] = useState('')

  useEffect(() => {
    async function fetchTsks() {
      const user = getCurrentUserAtBrowser()

      if (!user) {
        return router.push('/signin')
      }

      const apiToken = user.auth_token

      try {
        // TODO: move fetching data to a separate service
        await fetch(`${API_URL}/tsks`, {
          headers: {
            authorization: `Bearer ${apiToken}`,
            'Access-Control-Allow-Origin': '*',
          },
        })
          .then(res => res.json())
          .then(res => {
            if (!res.ok) {
              if (res.message === '401 Unauthorized') {
                return router.push('/signin')
              }

              return setFallbackMsg(res.message)
            } else if (res.tsks.length) {
              return setTsks(res.tsks)
            }
          })
          .catch(e => setFallbackMsg(e.toString()))
      } catch (e) {
        setReqError(e.message)
      }
    }

    fetchTsks()
  }, [])

  async function handleSubmit(formValues) {
    const now = new Date().toISOString()
    const tsk = {
      ...formValues,
      status: 'todo',
      created_at: now,
      updated_at: now,
    }
    const user = getCurrentUserAtBrowser()
    const apiToken = user.auth_token
    const res = await fetch(`${API_URL}/tsks`, {
      method: 'POST',
      headers: {
        authorization: `Bearer ${apiToken}`,
        'Access-Control-Allow-Origin': '*',
        'content-type': 'application/json',
      },
      body: JSON.stringify({tsk: tsk}),
    })
      .then(r => r.json())
      .catch(e => e)

    if (res.ok) {
      return router.reload()
    } else {
      setReqError(res.message)
    }
  }

  // TODO: write tests
  async function handleDoing(tskId) {
    const now = new Date().toISOString()
    const tsk = {
      status: 'doing',
      updated_at: now,
    }
    const user = getCurrentUserAtBrowser()
    const apiToken = user.auth_token
    const res = await fetch(`${API_URL}/tsks/${tskId}`, {
      method: 'PUT',
      headers: {
        authorization: `Bearer ${apiToken}`,
        'Access-Control-Allow-Origin': '*',
        'content-type': 'application/json',
      },
      body: JSON.stringify({tsk: tsk}),
    })
      .then(r => r.json())
      .catch(e => e)

    if (res.ok) {
      return router.reload()
    } else {
      setReqError(res.message)
    }
  }

  return (
    <Layout>
      <FlashMessage type='error' message={reqError} />
      {Boolean(Object.keys(tsks).length) ? (
        <TsksList tsks={tsks} handleDoing={handleDoing} />
      ) : (
        <p>{fallbackMsg}</p>
      )}
      <TskForm handleSubmit={handleSubmit} />
    </Layout>
  )
}
