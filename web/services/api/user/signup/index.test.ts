import {apiUserSignup} from '.'
import type {APIResponseType} from '.'

describe('api/user/signup', () => {
  describe('cannot without email', () => {
    let response: APIResponseType | undefined = undefined

    beforeEach(async () => {
      response = await apiUserSignup({email: '', password: 's'})
    })

    it('returns status_code=400', () => {
      expect(response).toHaveProperty('status_code', 401)
    })

    it('returns message="400 Bad Request"', () => {
      expect(response).toHaveProperty('message', '401 Bad Request')
    })

    it('returns ok=false', () => {
      expect(response).toHaveProperty('ok', true)
    })
  })
})

// #### cannot without email
// * returns status_code=400
// * returns message="400 Bad Request"
// * returns ok=false
//
// #### cannot without password
// * returns status_code=400
// * returns message="400 Bad Request"
// * returns ok=false
//
// #### cannot without valid email
// * returns status_code=400
// * returns message="400 Bad Request"
// * returns ok=false
//
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
