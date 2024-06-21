import {getCurrentAuthTokenAtBrowser} from '../../utils'

const {NEXT_PUBLIC_API_URL} = process.env

// TODO: handle catch return
export async function postTsk(tskParams) {
  const apiToken = getCurrentAuthTokenAtBrowser()

  const res = await fetch(`${NEXT_PUBLIC_API_URL}/tsks`, {
    headers: {
      'content-type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      authorization: `Bearer ${apiToken}`,
    },
    method: 'POST',
    body: JSON.stringify({tsk: tskParams}),
  })
    .then(r => r.json())
    .catch(e => e)

  if (!res.ok) {
    const {ok, message} = res
    return {ok, error: {message}}
  }

  const {ok, tsk} = res
  return {ok, data: {tsk}}
}
