import {getTsks} from '.'

const {NEXT_PUBLIC_API_URL} = process.env

describe('getTsks', () => {
  const successResponseBody = {ok: true, tsks: []}
  const apiHeaders = {
    headers: {
      'content-type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      authorization: 'Bearer null'
    },
  }


  describe('calls get tsks api', () => {
    beforeAll(() => {
      global.fetch = jest.fn(() => Promise.resolve({
        json: () => Promise.resolve(successResponseBody)
      }))
    })

    beforeEach(async () => {
      fetch.mockClear()
      await getTsks()
    })

    it('calls GET /v1/tsks endpoint with auth token', () => {
      const expectedEndpoint = `${NEXT_PUBLIC_API_URL}/tsks`

      expect(fetch).toHaveBeenCalledWith(expectedEndpoint, {
        ...apiHeaders,
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
      response = await getTsks()
    })

    it('returns ok', () => {
      expect(response).toHaveProperty('ok', successResponseBody.ok)
    })

    it('returns data containing tsks', () => {
      expect(response).toHaveProperty('data.tsks', successResponseBody.tsks)
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
      response = await getTsks()
    })

    it('returns not ok', () => {
      expect(response).toHaveProperty('ok', failedResponseBody.ok)
    })

    it('returns error containing message', () => {
      expect(response).toHaveProperty('error.message', failedResponseBody.message)
    })
  })
})