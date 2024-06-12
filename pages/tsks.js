import React, {useState, useEffect} from 'react'
import {useRouter} from 'next/router'
import {Layout, FlashMessage, TsksList, TskForm} from '../components'
import {
  getCurrentUserAtBrowser, 
  deleteCurrentUserAtBrowser, 
  deleteCurrentAuthTokenAtBrowser, 
  setCurrentAuthTokenAtBrowser
} from '../utils'
import { getTsks, postTsk, putTsk, getRefreshToken } from '../services'

export default function Tsks() {
  const router = useRouter()
  const [tsks, setTsks] = useState({})
  const [reqError, setReqError] = useState('')
  const [reqSuccess, setReqSuccess] = useState('')
  const fallbackMsg = 'tsks not found'

  async function refreshToken() {
    const {ok, data, error} = await getRefreshToken()

    if(!ok) {
      const isInvalidRefreshToken = error.message == '400 Bad Request'
      const isUnauthorizedRefreshToken = error.message == '401 Unauthorized'
      const isNotFoundRefreshToken = error.message == '404 Not Found'
      const isInvalidRequest = isInvalidRefreshToken || isUnauthorizedRefreshToken || isNotFoundRefreshToken

      if(isInvalidRequest) {
        deleteCurrentUserAtBrowser()
        deleteCurrentAuthTokenAtBrowser()
        router.push('/signin')
      }
    } else {
      setCurrentAuthTokenAtBrowser(data.auth_token)
      setReqSuccess('authentication renewed. please, try again')
    }
  }

  async function fetchTsks() {
    const user = getCurrentUserAtBrowser()

    if (!user) {
      return router.push('/signin')
    }

    const {ok, data, error} = await getTsks()

    if (!ok) {
      const isUnauthorizedAuthToken = error.message === '401 Unauthorized'
      const isForbiddenAuthToken = error.message === '403 Forbidden'

      if(isUnauthorizedAuthToken) {
        return refreshToken()
      }

      if(isForbiddenAuthToken) {
        deleteCurrentUserAtBrowser()
        deleteCurrentAuthTokenAtBrowser()
        return router.push('/signin')
      }

      return setReqError(error.message)
    } else if (data.tsks.length) {
      return setTsks(data.tsks)
    }
  }

  useEffect(() => {
    fetchTsks()
  }, [])

  // TODO: update tsk params (only tsk is necessary)
  async function handleSubmit(tsk) {
    const {ok, error} = await postTsk({tsk})

    if(!ok) {
      const isUnauthorizedAuthToken = error.message === '401 Unauthorized'

      if(isUnauthorizedAuthToken) {
        return refreshToken()
      }

      return setReqError(error.message)
    } else {
      fetchTsks()
    }
  }

  // TODO: update tsk params (only tsk is necessary)
  async function handleDoing(tskId) {
    const now = new Date().toISOString()
    const tsk = {
      status: 'doing',
      updated_at: now,
    }
    const {ok, error} = await putTsk({tskId, tsk})

    if(!ok) {
      const isUnauthorizedAuthToken = error.message === '401 Unauthorized'

      if(isUnauthorizedAuthToken) {
        return refreshToken()
      }

      setReqError(error.message)
    } else {
      fetchTsks()
    }
  }

  async function handleDone(tskId) {
    const now = new Date().toISOString()
    const tsk = {
      status: 'done',
      updated_at: now,
    }
    
    const {ok, error} = await putTsk({tskId, tsk})

    if(!ok) {
      const isUnauthorizedAuthToken = error.message === '401 Unauthorized'

      if(isUnauthorizedAuthToken) {
        return refreshToken()
      }

      setReqError(error.message)
    } else {
      fetchTsks()
    }
  }

  async function handleDelete(tskId) {
    const now = new Date().toISOString()
    const tsk = {
      deleted_at: now
    }
    
    const {ok, error} = await putTsk({tskId, tsk})

    if(!ok) {
      const isUnauthorizedAuthToken = error.message === '401 Unauthorized'

      if(isUnauthorizedAuthToken) {
        return refreshToken()
      }

      setReqError(error.message)
    } else {
      setReqSuccess('deleted succesfully')
      fetchTsks()
    }
  }

  return (
    <Layout>
      {reqError && (<FlashMessage type='error' message={reqError} />)}
      {reqSuccess && (<FlashMessage type='success' message={reqSuccess} />)}
      <TskForm handleSubmit={handleSubmit} />
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
    </Layout>
  )
}
