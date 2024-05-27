# tsks tests cases

## API

### POST signup

**cannot without email**
* returns status_code=400
* returns message="400 Bad Request"
* returns ok=false

**cannot without password**
* returns status_code=400
* returns message="400 Bad Request"
* returns ok=false

**cannot without valid email**
* returns status_code=400
* returns message="400 Bad Request"
* returns ok=false

**cannot with already registered email**
* returns status_code=409
* returns message="409 Conflict"
* returns ok=false

**signup succesfully**
* returns status_code=201
* returns message="201 Created"
* returns ok=true
* returns user
* returns auth token
* returns refresh token
* saves user on db
* saves refresh token on db

### POST signin

**cannot without email**
* returns status_code=400
* returns message="400 Bad Request"
* returns ok=false

**cannot without valid email**
* returns status_code=400
* returns message="400 Bad Request"
* returns ok=false

**cannot without registered email**
* returns status_code=404
* returns message="404 Not Found"
* returns ok=false

**cannot without password**
* returns status_code=400
* returns message="400 Bad Request"
* returns ok=false

**cannot without correct password**
* returns status_code=401
* returns message="401 Unauthorized"
* returns ok=false

**signin succesfully**
* returns status_code=200
* returns message="200 Success"
* returns ok=true
* returns user
* returns auth token
* returns refresh token
* saves refresh token on db

### authentication tokens
* create auth token with expiration time
* create refresh token with expiration time

### POST refresh_token

**cannot without refresh token**
* returns status_code=400
* returns message="400 Bad Request"
* returns ok=false

**cannot without valid refresh token**

*when refresh token is invalid*
* returns status_code=400
* returns message="400 Bad Request"
* returns ok=false

*when refresh token is unauthorized*
* returns status_code=401
* returns message="401 Unauthorized"
* returns ok=false

**refresh token succesfully**
* returns status_code=201
* returns message="201 Created"
* returns ok=true
* returns refresh token
* saves refresh token on db

### GET tsks

**cannot without auth token**
* returns status_code=401
* returns message="401 Unauthorized"
* returns ok=false

**cannot without valid auth token**
* returns status_code=403
* returns message="403 Forbidden"
* returns ok=false

**get succesfully**
* returns status_code=200
* returns message="200 Success"
* returns ok=true
* returns tsks
* returns only not deleted tsks

### POST tsk

**cannot without auth token**
* returns status_code=401
* returns message="401 Unauthorized"
* returns ok=false

**cannot without valid auth token**
* returns status_code=403
* returns message="403 Forbidden"
* returns ok=false

**cannot without tsk**
* returns status_code=400
* returns message="400 Bad Request"
* returns ok=false

**cannot without valid tsk**
* returns status_code=400
* returns message="400 Bad Request"
* returns ok=false

**post succesfully**
* returns status_code=201
* returns message="201 Created"
* returns ok=true
* returns tsks

### PUT tsk

**cannot without auth token**
* returns status_code=401
* returns message="401 Unauthorized"
* returns ok=false

**cannot without valid auth token**
* returns status_code=403
* returns message="403 Forbidden"
* returns ok=false

**cannot without tsk**
* returns status_code=400
* returns message="400 Bad Request"
* returns ok=false

**cannot without valid tsk**
* returns status_code=400
* returns message="400 Bad Request"
* returns ok=false

**cannot unexistent tsk**
* returns status_code=404
* returns message="404 Not Found"
* returns ok=false

**put succesfully**
* returns status_code=200
* returns message="200 Success"
* returns ok=true
* returns tsk

### DELETE tsk

**cannot without auth token**
* returns status_code=401
* returns message="401 Unauthorized"
* returns ok=false

**cannot without valid auth token**
* returns status_code=403
* returns message="403 Forbidden"
* returns ok=false

**cannot without valid id**
* returns status_code=400
* returns message="400 Bad Request"
* returns ok=false

**cannot unexistent tsk**
* returns status_code=404
* returns message="404 Not Found"
* returns ok=false

**delete succesfully**
* returns status_code=204

*--

## WEB

### home

**when has session**
* redirects to tsks

**when has not session**
* redirects to signin

### signup

**cannot without email**
* renders "required"

**cannot without password**
* renders "required"

**cannot without valid email**
* renders "invalid email"

**cannot without unregistered email**
* renders "email already registered"

**signup succesfully**
* saves user on localStorage
- saves auth token on localStorage
* redirects to /tsks

**renders a link to signin**
* renders a link to signin
* redirects to signin when clicking

### signin

**cannot without email**
* renders "required"

**cannot without valid email**
* renders "invalid email"

**cannot without registered email**
* renders "email not registered"

**cannot without password**
* renders "required"

**cannot without correct password**
* renders "incorrect password"

**signin succesfully**
* saves user on localStorage
- saves auth token on localStorage
* redirects to /tsks

**renders a link to signup**
* renders a link to signup
* redirects to signup when clicking

### tsks

**cannot without authentication token**
* redirects to /signin

**cannot without valid auth token**

*when auth token is unauthorized*

*requests refresh token*

_when refresh token is not valid_
- removes user from localStorage
- removes auth token from localStorage
- redirects to /signin

_when refresh token is unauthorized_
- removes user from localStorage
- removes auth token from localStorage
- redirects to /signin

_when refresh token is returned_
- saves auth token on localStorage
- renders "authentication renewed. please, try again"

*when auth token is forbidden*
* removes user from localStorage
* redirects to /signin

#### GET tsks

**get succesfully**

*when has tsks*
* renders tsks

*when has not tsks*
* renders "tsks not found"

#### POST tsk

**cannot without valid auth token**

*when auth token is unauthorized*

*requests refresh token*

_when refresh token is not valid_
- removes user from localStorage
- removes auth token from localStorage
- redirects to /signin

_when refresh token is unauthorized_
- removes user from localStorage
- removes auth token from localStorage
- redirects to /signin

_when refresh token is returned_
- saves auth token on localStorage
- renders "authentication renewed. please, try again"

**cannot without tsk**
* renders "cannot without tsk"

**post succesfully**
* renders tsk
* clears tsk input

#### PUT tsk

**cannot without valid auth token**

*when auth token is unauthorized*

*requests refresh token*

_when refresh token is not valid_
- removes user from localStorage
- removes auth token from localStorage
- redirects to /signin

_when refresh token is unauthorized_
- removes user from localStorage
- removes auth token from localStorage
- redirects to /signin

_when refresh token is returned_
- saves auth token on localStorage
- renders "authentication renewed. please, try again"

**cannot unexistent tsk**
* renders "cannot unexistent tsk"

**put succesfully**

*put doing tsk*
* renders tsk

*put done tsk*
* renders tsk

*put tsk content*
* renders tsk

#### DELETE tsk

**cannot without valid auth token**

*when auth token is unauthorized*

*requests refresh token*

_when refresh token is not valid_
- removes user from localStorage
- removes auth token from localStorage
- redirects to /signin

_when refresh token is unauthorized_
- removes user from localStorage
- removes auth token from localStorage
- redirects to /signin

_when refresh token is returned_
- saves auth token on localStorage
- renders "authentication renewed. please, try again"

**delete succesfully**
* renders "deleted succesfully"
* remove tsk from render

#### renders tsk

* renders tsk
* renders context

**renders status**

*when todo*
* renders "-"

*when doing*
* renders "+"

*when done*
* renders "*"