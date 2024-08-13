import {useState, useEffect} from 'react'
import {useRouter} from 'next/router'
import {Layout, FlashMessage, TsksList, TskForm, Subtitle} from '../components'
import {
  getCurrentUserAtBrowser,
  deleteCurrentUserAtBrowser,
  deleteCurrentAuthTokenAtBrowser,
  setCurrentAuthTokenAtBrowser,
} from '../utils'
import {
  getTsks,
  postTsk,
  deleteTsk,
  getRefreshToken,
  putTskToDoing,
  putTskToDone,
} from '../services'

export default function Tsks() {
  const router = useRouter()
  const [tsks, setTsks] = useState(null)
  const [reqError, setReqError] = useState(null)
  const [reqSuccess, setReqSuccess] = useState(null)
  const [isTskFormLoading, setIsTskFormLoading] = useState(null)
  const [isTsksLoading, setIsTsksLoading] = useState(null)
  const [isTskLoading, setIsTskLoading] = useState(null)
  const fallbackMsg = 'tsks not found'

  async function refreshToken() {
    const {ok, data} = await getRefreshToken()

    if (!ok) {
      deleteCurrentUserAtBrowser()
      deleteCurrentAuthTokenAtBrowser()
      return router.push('/signin')
    }

    setCurrentAuthTokenAtBrowser(data.auth_token)
    setReqSuccess('authentication renewed. please, try again')
  }

  async function fetchTsks() {
    const user = getCurrentUserAtBrowser()
    if (!user) return router.push('/signin')

    setIsTsksLoading(true)
    const {ok, data, error, isReady} = await getTsks()
    setIsTsksLoading(!isReady)

    if (!ok) {
      const isUnauthorizedAuthToken = error.message === '401 Unauthorized'
      const isForbiddenAuthToken = error.message === '403 Forbidden'

      if (isUnauthorizedAuthToken) return refreshToken()

      if (isForbiddenAuthToken) {
        deleteCurrentUserAtBrowser()
        deleteCurrentAuthTokenAtBrowser()
        return router.push('/signin')
      }

      return setReqError(error.message)
    }

    return setTsks(data.tsks)
  }

  useEffect(() => {
    fetchTsks()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // TODO: update tsk params (only tsk is necessary)
  async function handleSubmit(tsk) {
    setIsTskFormLoading(true)
    const {ok, error, isReady} = await postTsk(tsk)
    setIsTskFormLoading(!isReady)

    if (!ok) {
      const isUnauthorizedAuthToken = error.message === '401 Unauthorized'
      if (isUnauthorizedAuthToken) return refreshToken()
      return setReqError(error.message)
    }

    return fetchTsks()
  }

  // TODO: update tsk params (only tsk is necessary)
  async function handleDoing(tskId) {
    const {ok, error} = await putTskToDoing({tskId})

    if (!ok) {
      const isUnauthorizedAuthToken = error.message === '401 Unauthorized'
      if (isUnauthorizedAuthToken) return refreshToken()
      return setReqError(error.message)
    }

    return fetchTsks()
  }

  async function handleDone(tskId) {
    const {ok, error} = await putTskToDone({tskId})

    if (!ok) {
      const isUnauthorizedAuthToken = error.message === '401 Unauthorized'
      if (isUnauthorizedAuthToken) return refreshToken()
      return setReqError(error.message)
    }

    return fetchTsks()
  }

  async function handleDelete(tskId) {
    setIsTskLoading(true)
    const {ok, error, isReady} = await deleteTsk({tskId})
    setIsTskLoading(!isReady)

    if (!ok) {
      const isUnauthorizedAuthToken = error.message === '401 Unauthorized'
      if (isUnauthorizedAuthToken) return refreshToken()
      return setReqError(error.message)
    }

    setReqSuccess('deleted succesfully')
    return fetchTsks()
  }

  return (
    <Layout>
      {reqError && <FlashMessage type='error' message={reqError} />}
      {reqSuccess && <FlashMessage type='success' message={reqSuccess} />}
      <TskForm handleSubmit={handleSubmit} isLoading={isTskFormLoading} />
      <Subtitle value='all tsks' />
      <TsksList
        tsks={tsks}
        handleDoing={handleDoing}
        handleDone={handleDone}
        handleDelete={handleDelete}
        fallbackMsg={fallbackMsg}
        isLoading={isTsksLoading}
        isTskLoading={isTskLoading}
      />
    </Layout>
  )
}
