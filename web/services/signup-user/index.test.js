import {signUpUser} from '.'

const {NEXT_PUBLIC_API_URL} = process.env

describe('signUpUser', () => {
  const userEmail = 'signup@tsks.com'
  const userPassword = 'pass'
  const successResponseBody = {ok: true, user: {}, auth_token: 'token'}
  const apiHeaders = {
    headers: {
      'content-type': 'application/json',
    },
    credentials: 'include',
  }

  describe('calls signup api', () => {
    beforeAll(() => {
      global.fetch = jest.fn(() =>
        Promise.resolve({
          json: () => Promise.resolve(successResponseBody),
        })
      )
    })

    beforeEach(async () => {
      fetch.mockClear()
      await signUpUser({email: userEmail, password: userPassword})
    })

    it('calls POST /v1/signup endpoint with received credentials', () => {
      const expectedMethod = 'POST'
      const expectedEndpoint = `${NEXT_PUBLIC_API_URL}/signup`
      const expectedBody = JSON.stringify({
        email: userEmail,
        password: userPassword,
      })

      expect(fetch).toHaveBeenCalledWith(expectedEndpoint, {
        ...apiHeaders,
        method: expectedMethod,
        body: expectedBody,
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
      response = await signUpUser({email: userEmail, password: userPassword})
    })

    it('returns ok', () => {
      expect(response).toHaveProperty('ok', successResponseBody.ok)
    })

    it('returns data containing user', () => {
      expect(response).toHaveProperty('data.user', successResponseBody.user)
    })

    it('returns data containing auth token', () => {
      expect(response).toHaveProperty(
        'data.auth_token',
        successResponseBody.auth_token
      )
    })

    it('returns is ready', () => {
      expect(response).toHaveProperty('isReady', true)
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
      response = await signUpUser({email: userEmail, password: userPassword})
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

    it('returns is ready', () => {
      expect(response).toHaveProperty('isReady', true)
    })
  })

  describe('when request breaks', () => {
    let response = null

    beforeAll(() => {
      global.fetch = jest.fn(() =>
        Promise.reject(new Error('500 Internal Server Error'))
      )
    })

    beforeEach(async () => {
      fetch.mockClear()
      response = await signUpUser({email: userEmail, password: userPassword})
    })

    it('returns not ok', () => {
      expect(response).toHaveProperty('ok', false)
    })

    it('returns error containing message', () => {
      expect(response).toHaveProperty(
        'error.message',
        '500 Internal Server Error'
      )
    })

    it('returns is ready', () => {
      expect(response).toHaveProperty('isReady', true)
    })
  })

  // NOTE: this test will not work since it is awaiting for complete behavior
  // i.e. signUpUser will return the last `isReady` value which is `true`
  //describe('when request is loading', () => {
  //  let response = null

  //  beforeAll(() => {
  //    global.fetch = jest.fn(() => Promise.resolve())
  //  })

  //  beforeEach(async () => {
  //    fetch.mockClear()
  //    response = await signUpUser({email: userEmail, password: userPassword})
  //  })

  //  it('returns is not ready', () => {
  //    expect(response).toHaveProperty('isReady', false)
  //  })
  //})
})
