import {postTsk} from '.'

const {NEXT_PUBLIC_API_URL} = process.env

describe('postTsk', () => {
  const fakeTsk = {tsk: 'this is a fake tsk'}
  const successResponseBody = {ok: true, tsk: fakeTsk}
  const apiHeaders = {
    headers: {
      'content-type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      authorization: 'Bearer null',
    },
  }

  describe('calls post tsk api', () => {
    beforeAll(() => {
      global.fetch = jest.fn(() =>
        Promise.resolve({
          json: () => Promise.resolve(successResponseBody),
        })
      )
    })

    beforeEach(async () => {
      fetch.mockClear()
      await postTsk(fakeTsk)
    })

    it('calls POST /v1/tsks endpoint with auth token and tsk', () => {
      const expectedEndpoint = `${NEXT_PUBLIC_API_URL}/tsks`
      const expectedMethod = 'POST'
      const expectedBody = JSON.stringify({tsk: fakeTsk})

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
      response = await postTsk(fakeTsk)
    })

    it('returns ok', () => {
      expect(response).toHaveProperty('ok', successResponseBody.ok)
    })

    it('returns data containing tsk', () => {
      expect(response).toHaveProperty('data.tsk', successResponseBody.tsk)
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
      response = await postTsk(fakeTsk)
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
      response = await postTsk(fakeTsk)
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
})
