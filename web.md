# tsks-web

## FEATURES

### home

* when has session redirects to tsks
* when has not session redirects to signin

### signup

* cannot without email
* cannot without password
* cannot without valid email
* cannot without unregistered email
* signup succesfully
* renders a link to signin

### signin

* cannot without email
* cannot without valid email
* cannot without registered email
* cannot without password
* cannot without correct password
* signin succesfully
* renders a link to signup

### refresh token

**when refresh token is not valid**
- removes user from localStorage
- removes auth token from localStorage
- redirects to /signin

**when refresh token is unauthorized**
- removes user from localStorage
- removes auth token from localStorage
- redirects to /signin

**when refresh token owner is not found**
- removes user from localStorage
- removes auth token from localStorage
- redirects to /signin

**refresh token succesfully**
- saves auth token on localStorage
- renders "authentication renewed. please, try again"

### tsks

* cannot without authentication token

**cannot without valid authentication token**

*when unauthorized*
* requests refresh token

*when forbidden*
* removes user from localStorage
* removes auth token from localStorage
* redirects to /signin

#### GET tsks

**get succesfully**
* when has tsks
* when has not tsks

#### POST tsk

**cannot without valid authentication token**

*when unauthorized*
* requests refresh token

* cannot without tsk
* post succesfully

#### PUT tsk

**cannot without valid authentication token**

*when unauthorized*
* requests refresh token

* cannot unexistent tsk

**put succesfully**
* put doing tsk
* put done tsk
* put tsk content

#### DELETE tsk

**cannot without valid authentication token**

*when unauthorized*
* requests refresh token

* delete succesfully

#### renders tsk

* renders tsk
* renders context
* renders status

### errors possibilities

- 400
- 401
- 403
- 404
- 500