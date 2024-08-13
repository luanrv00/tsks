const NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL

// TODO: handle catch return
export async function getRefreshToken() {
  const res = await fetch(`${NEXT_PUBLIC_API_URL}/refresh_token`, {
    headers: {
      'content-type': 'application/json',
    },
    method: 'POST',
    credentials: 'include',
  })
    .then(r => r.json())
    .catch(e => e)

  if (!res.ok) {
    const {ok, message} = res
    return {ok: Boolean(ok), error: {message}, data: null}
  }

  const {ok, auth_token} = res
  return {ok, data: {auth_token}, error: null}
}
