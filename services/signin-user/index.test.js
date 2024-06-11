import {signInUser} from '.'

const {NEXT_PUBLIC_API_URL} = process.env

describe('signInUser', () => {
  const userEmail = 'signin@tsks.com'
  const userPassword = 'pass'
  const successResponseBody = {ok: true, user: {}, auth_token: 'token'}
  const apiHeaders = {
    headers: {
      'content-type': 'application/json',
    },
    credentials: 'include',
  }


  describe('calls signin api', () => {
    beforeAll(() => {
      global.fetch = jest.fn(() => Promise.resolve({
        json: () => Promise.resolve(successResponseBody)
      }))
    })

    beforeEach(async () => {
      fetch.mockClear()
      await signInUser({email: userEmail, password: userPassword})
    })

    it('calls POST /v1/signin endpoint with received credentials', () => {
      const expectedMethod = 'POST'
      const expectedEndpoint = `${NEXT_PUBLIC_API_URL}/signin`
      const expectedBody = JSON.stringify({email: userEmail, password: userPassword})

      expect(fetch).toHaveBeenCalledWith(expectedEndpoint, {
        ...apiHeaders,
        method: expectedMethod,
        body: expectedBody
      })
    })
  })

  describe('when request is succesfull', () => {
    let response = null

    beforeAll(() => {
      global.fetch = jest.fn(() => Promise.resolve({
        json: () => Promise.resolve(successResponseBody)
      }))
    })

    beforeEach(async () => {
      fetch.mockClear()
      response = await signInUser({email: userEmail, password: userPassword})
    })

    it('returns ok', () => {
      expect(response).toHaveProperty('ok', successResponseBody.ok)
    })

    it('returns data containing user', () => {
      expect(response).toHaveProperty('data.user', successResponseBody.user)
    })

    it('returns data containing auth token', () => {
      expect(response).toHaveProperty('data.auth_token', successResponseBody.auth_token)
    })
  })

  describe('when request is failed', () => {
    const failedResponseBody = {ok: false, message: '401 Unauthorized'}
    let response = null

    beforeAll(() => {
      global.fetch = jest.fn(() => Promise.resolve({
        json: () => Promise.resolve(failedResponseBody)
      }))
    })

    beforeEach(async () => {
      fetch.mockClear()
      response = await signInUser({email: userEmail, password: userPassword})
    })

    it('returns not ok', () => {
      expect(response).toHaveProperty('ok', failedResponseBody.ok)
    })

    it('returns error containing message', () => {
      expect(response).toHaveProperty('error.message', failedResponseBody.message)
    })
  })
})