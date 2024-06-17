import {getRefreshToken} from '.'

const {NEXT_PUBLIC_API_URL} = process.env

describe('getRefreshToken', () => {
  const successResponseBody = {ok: true, auth_token: 'auth token'}
  const apiHeaders = {
    headers: {
      'content-type': 'application/json',
    },
    credentials: 'include',
  }

  describe('calls refresh token api', () => {
    beforeAll(() => {
      global.fetch = jest.fn(() =>
        Promise.resolve({
          json: () => Promise.resolve(successResponseBody),
        })
      )
    })

    beforeEach(async () => {
      fetch.mockClear()
      await getRefreshToken()
    })

    it('calls POST /v1/refresh_token endpoint', () => {
      const expectedEndpoint = `${NEXT_PUBLIC_API_URL}/refresh_token`
      const expectedMethod = 'POST'

      expect(fetch).toHaveBeenCalledWith(expectedEndpoint, {
        ...apiHeaders,
        method: expectedMethod,
      })
    })
  })

  describe('when request is succesfull', () => {
    let response = null

    beforeAll(() => {
      global.fetch = jest.fn(() =>
        Promise.resolve({
          json: () => Promise.resolve(successResponseBody),
        })
      )
    })

    beforeEach(async () => {
      fetch.mockClear()
      response = await getRefreshToken()
    })

    it('returns ok', () => {
      expect(response).toHaveProperty('ok', successResponseBody.ok)
    })

    it('returns data containing auth token', () => {
      expect(response).toHaveProperty(
        'data.auth_token',
        successResponseBody.auth_token
      )
    })
  })

  describe('when request is failed', () => {
    const failedResponseBody = {ok: false, message: '401 Unauthorized'}
    let response = null

    beforeAll(() => {
      global.fetch = jest.fn(() =>
        Promise.resolve({
          json: () => Promise.resolve(failedResponseBody),
        })
      )
    })

    beforeEach(async () => {
      fetch.mockClear()
      response = await getRefreshToken()
    })

    it('returns not ok', () => {
      expect(response).toHaveProperty('ok', failedResponseBody.ok)
    })

    it('returns error containing message', () => {
      expect(response).toHaveProperty(
        'error.message',
        failedResponseBody.message
      )
    })
  })
})
