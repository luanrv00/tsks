import {deleteTsk} from '.'

const {NEXT_PUBLIC_API_URL} = process.env

describe('deleteTsk', () => {
  const fakeTskId = 0
  const successResponseBody = {ok: true}
  const apiHeaders = {
    headers: {
      'content-type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      authorization: 'Bearer null'
    },
  }


  describe('calls delete tsk api', () => {
    beforeAll(() => {
      global.fetch = jest.fn(() => Promise.resolve({
        json: () => Promise.resolve(successResponseBody)
      }))
    })

    beforeEach(async () => {
      fetch.mockClear()
      await deleteTsk({tskId: fakeTskId})
    })

    it('calls DELETE /v1/tsks/:id endpoint with auth token', () => {
      const expectedEndpoint = `${NEXT_PUBLIC_API_URL}/tsks/${fakeTskId}`
      const expectedMethod = 'DELETE'

      expect(fetch).toHaveBeenCalledWith(expectedEndpoint, {
        ...apiHeaders,
        method: expectedMethod,
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
      response = await deleteTsk({tskId: fakeTskId})
    })

    it('returns ok', () => {
      expect(response).toHaveProperty('ok', successResponseBody.ok)
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
      response = await deleteTsk({tskId: fakeTskId})
    })

    it('returns not ok', () => {
      expect(response).toHaveProperty('ok', failedResponseBody.ok)
    })

    it('returns error containing message', () => {
      expect(response).toHaveProperty('error.message', failedResponseBody.message)
    })
  })
})