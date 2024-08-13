const NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL

// TODO: handle catch return
export async function signInUser({email, password}) {
  const res = await fetch(`${NEXT_PUBLIC_API_URL}/signin`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify({email, password}),
    credentials: 'include',
  })
    .then(r => r.json())
    .catch(e => e)

  if (!res.ok) {
    const {ok, message} = res
    return {ok: Boolean(ok), error: {message}, isReady: true}
  }

  const {ok, user, auth_token} = res
  return {ok, data: {user, auth_token}, isReady: true}
}
