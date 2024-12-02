import {apiUserSignup} from '.'

jest.mock('../../../../lib/drizzle')
import {db} from '../../../../lib'

describe('apiUserSignup', () => {
  describe('cannot without email', () => {
    let response = null

    beforeEach(async () => {
      response = await apiUserSignup({email: '', password: 's'})
    })

    it('returns status_code=400', () => {
      expect(response).toHaveProperty('status_code', 400)
    })

    it('returns message="400 Bad Request"', () => {
      expect(response).toHaveProperty('message', '400 Bad Request')
    })

    it('returns ok=false', () => {
      expect(response).toHaveProperty('ok', false)
    })
  })

  describe('cannot without password', () => {
    let response = null

    beforeEach(async () => {
      response = await apiUserSignup({email: '', password: ''})
    })

    it('returns status_code=400', () => {
      expect(response).toHaveProperty('status_code', 400)
    })

    it('returns message="400 Bad Request"', () => {
      expect(response).toHaveProperty('message', '400 Bad Request')
    })

    it('returns ok=false', () => {
      expect(response).toHaveProperty('ok', false)
    })
  })

  describe('cannot without valid email', () => {
    let response = null

    beforeEach(async () => {
      response = await apiUserSignup({email: 'random', password: 's'})
    })

    it('returns status_code=400', () => {
      expect(response).toHaveProperty('status_code', 400)
    })

    it('returns message="400 Bad Request"', () => {
      expect(response).toHaveProperty('message', '400 Bad Request')
    })

    it('returns ok=false', () => {
      expect(response).toHaveProperty('ok', false)
    })
  })

  describe('cannot without already registered email', () => {
    let response = null

    beforeEach(async () => {
      db.mockReturnValue([{}])
      response = await apiUserSignup({email: 'a@b.c', password: 's'})
    })

    it('returns status_code=409', () => {
      expect(response).toHaveProperty('status_code', 409)
    })

    it('returns message="409 Conflict"', () => {
      expect(response).toHaveProperty('message', '409 Conflict')
    })

    it('returns ok=false', () => {
      expect(response).toHaveProperty('ok', false)
    })
  })
})
// #### cannot with already registered email
// * returns status_code=409
// * returns message="409 Conflict"
// * returns ok=false
//
// #### signup succesfully
// * returns status_code=201
// * returns message="201 Created"
// * returns ok=true
// * returns user
// * returns auth token
// * returns refresh token
// * saves user on db
// * saves refresh token on db
