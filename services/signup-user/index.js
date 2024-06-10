const {NEXT_PUBLIC_API_URL} = process.env

// TODO: handle catch return
export async function signUpUser({email, password}) {
  const res = await fetch(`${NEXT_PUBLIC_API_URL}/signup`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify({email, password}),
    credentials: 'include'
  })
    .then(r => r.json())
    .catch(e => e)

  if(!res.ok) {
    const {ok, message} = res
    return {ok, error: {message: message}, data: null}
  }

  const {ok, user, auth_token} = res
  return {ok, data: {user, auth_token}, error: null}
}