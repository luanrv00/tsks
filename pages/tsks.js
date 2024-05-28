import React, {useState, useEffect} from 'react'
import {useRouter} from 'next/router'
import {Layout, FlashMessage, TsksList, TskForm} from '../components'
import {
  getCurrentUserAtBrowser, 
  deleteCurrentUserAtBrowser, 
  deleteCurrentAuthTokenAtBrowser, 
  getCurrentAuthTokenAtBrowser
} from '../utils'

const API_URL = process.env.NEXT_PUBLIC_API_URL

export default function Tsks() {
  const router = useRouter()
  const [tsks, setTsks] = useState({})
  const [fallbackMsg, setFallbackMsg] = useState('tsks not found')
  const [reqError, setReqError] = useState('')
  const [reqSuccess, setReqSuccess] = useState('')

  async function refreshToken() {
    await fetch(`${API_URL}/refresh_token`, {
      method: 'POST'
    })
      .then(res => res.json())
      .then(res => {
        if(!res.ok) {
          const isInvalidRefreshToken = res.message == "400 Bad Request"

          if(isInvalidRefreshToken) {
            deleteCurrentUserAtBrowser()
          }
        }
      })
  }

  async function fetchTsks() {
    const user = getCurrentUserAtBrowser()

    if (!user) {
      return router.push('/signin')
    }

    const apiToken = getCurrentAuthTokenAtBrowser()

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
            const isUnauthorizedAuthToken = res.message === '401 Unauthorized'
            const isForbiddenAuthToken = res.message === '403 Forbidden'

            if(isUnauthorizedAuthToken) {
              return refreshToken()
            }

            if(isForbiddenAuthToken) {
              deleteCurrentUserAtBrowser()
              deleteCurrentAuthTokenAtBrowser()
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

  useEffect(() => {
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
    const apiToken = getCurrentAuthTokenAtBrowser()
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
      fetchTsks()
    } else {
      setReqError(res.message)
    }
  }

  async function handleDoing(tskId) {
    const now = new Date().toISOString()
    const tsk = {
      status: 'doing',
      updated_at: now,
    }
    const apiToken = getCurrentAuthTokenAtBrowser()
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
      fetchTsks()
    } else {
      setReqError(res.message)
    }
  }

  async function handleDone(tskId) {
    const now = new Date().toISOString()
    const tsk = {
      status: 'done',
      updated_at: now,
    }
    const apiToken = getCurrentAuthTokenAtBrowser()
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
      fetchTsks()
    } else {
      setReqError(res.message)
    }
  }

  async function handleDelete(tskId) {
    const now = new Date().toISOString()
    const tsk = {
      deleted_at: now
    }
    const apiToken = getCurrentAuthTokenAtBrowser()
    const res = await fetch(`${API_URL}/tsks/${tskId}`, {
      method: 'PUT',
      headers: {
        authorization: `Bearer ${apiToken}`,
        'Access-Control-Allow-Origin': '*',
        'content-type': 'application/json',
      },
      body: JSON.stringify({tsk: tsk})
    })
      .then(r => r.json())
      .catch(e => e)

    if (res.ok) {
      setReqSuccess('deleted succesfully')
      fetchTsks()
    } else {
      setReqError(res.message)
    }
  }

  return (
    <Layout>
      {reqError && (<FlashMessage type='error' message={reqError} />)}
      {reqSuccess && (<FlashMessage type='success' message={reqSuccess} />)}
      {Boolean(Object.keys(tsks).length) ? (
        <TsksList 
          tsks={tsks} 
          handleDoing={handleDoing} 
          handleDone={handleDone} 
          handleDelete={handleDelete} 
          />
      ) : (
        <p>{fallbackMsg}</p>
      )}
      <TskForm handleSubmit={handleSubmit} />
    </Layout>
  )
}
