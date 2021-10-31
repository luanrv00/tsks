import React, {useState, useEffect} from 'react'
import groupTsksByContext from '../utils/group-tsks-by-context'
import TsksList from '../components/tsks-list'

const NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL
const NEXT_PUBLIC_API_TOKEN = process.env.NEXT_PUBLIC_API_TOKEN

export default function Tsks() {
  const [tsks, setTsks] = useState({})
  const [fallbackMsg, setFallbackMsg] = useState('No tsks found')

  const handleError = e => {
    setFallbackMsg(e.toString())
  }

  useEffect(async () => {
    try {
      // TODO: move fetching data to a separate service
      await fetch(`${NEXT_PUBLIC_API_URL}/tsks`, {
        headers: {
          'authorization': `Bearer ${NEXT_PUBLIC_API_TOKEN}`,
          'Access-Control-Allow-Origin': '*'
        }
      })
        .then(res => res.json())
        .then(res => {
          if (!res.ok) {
            return setFallbackMsg(res.msg)
          } else if (res.tsks.length && !res.error) {
            return setTsks(groupTsksByContext(res.tsks))
          }
        })
        .catch(e => handleError(e))
    } catch (e) { handleError(e) }
  }, [])

  return (
    <div className='tsks'>
      {Boolean(Object.keys(tsks).length) ? Object.entries(tsks).map(tsksData =>
        <TsksList tsksData={tsksData}/>
      ) : (
        <p>{fallbackMsg}</p>
      )}
    </div>
  )
}
