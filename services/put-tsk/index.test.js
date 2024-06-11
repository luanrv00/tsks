import {putTsk} from '.'

const {NEXT_PUBLIC_API_URL} = process.env

describe('putTsk', () => {
  const fakeTskId = 0
  const fakeTsk = {tsk: 'this is a fake tsk'}
  const successResponseBody = {ok: true, tsk: fakeTsk}
  const apiHeaders = {
    headers: {
      'content-type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      authorization: 'Bearer null'
    },
  }


  describe('calls put tsk api', () => {
    beforeAll(() => {
      global.fetch = jest.fn(() => Promise.resolve({
        json: () => Promise.resolve(successResponseBody)
      }))
    })

    beforeEach(async () => {
      fetch.mockClear()
      await putTsk({tskId: fakeTskId, tsk: fakeTsk})
    })

    it('calls PUT /v1/tsks endpoint with auth token and tsk', () => {
      const expectedEndpoint = `${NEXT_PUBLIC_API_URL}/tsks/${fakeTskId}`
      const expectedMethod = 'PUT'
      const expectedBody = JSON.stringify({tsk: fakeTsk})

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
      response = await putTsk({tskId: fakeTskId, tsk: fakeTsk})
    })

    it('returns ok', () => {
      expect(response).toHaveProperty('ok', successResponseBody.ok)
    })

    it('returns data containing tsk', () => {
      expect(response).toHaveProperty('data.tsk', successResponseBody.tsk)
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
      response = await putTsk({tskId: fakeTskId, tsk: fakeTsk})
    })

    it('returns not ok', () => {
      expect(response).toHaveProperty('ok', failedResponseBody.ok)
    })

    it('returns error containing message', () => {
      expect(response).toHaveProperty('error.message', failedResponseBody.message)
    })
  })
})