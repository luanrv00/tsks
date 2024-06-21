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
* clears tsk input
* clears context input

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

**when signing up**
* renders loading button
- calls signup api

**when signing up fails**
* renders error message

**signup succesfully**
* saves user on localStorage
* saves auth token on localStorage
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

**when signing in**
* renders loading button
- calls signin api

**when signing in fails**
* renders error message

**signin succesfully**
* saves user on localStorage
* saves auth token on localStorage
* redirects to /tsks

**renders a link to signup**
* renders a link to signup
* redirects to signup when clicking

### refresh token

**when refresh token is not valid**
* removes user from localStorage
* removes auth token from localStorage
* redirects to /signin

**when refresh token is unauthorized**
* removes user from localStorage
* removes auth token from localStorage
* redirects to /signin

**when refresh token owner is not found**
* removes user from localStorage
* removes auth token from localStorage
* redirects to /signin

**when refreshing token**
- calls refresh token api

**when refresh token fails**
- renders error message

**refresh token succesfully**
* saves auth token on localStorage
* renders "authentication renewed. please, try again"

### tsks

**cannot without authentication token**
* redirects to /signin

**cannot without valid authentication token**

*when auth token is unauthorized*
* requests refresh token

*when auth token is forbidden*
* removes user from localStorage
* removes auth token from localStorage
* redirects to /signin

**access succesfully**
- calls user api
- renders user email
- renders user avatar

#### GET tsks

**when getting**
- renders loading
- calls GET tsks api

**when getting fails**
* renders error message

**get succesfully**

*when has tsks*
* renders tsks

*when has not tsks*
* renders "tsks not found"

#### POST tsk

**cannot without tsk**
* renders "cannot without tsk"

**when posting**
* renders loading
- calls POST tsk api

**when posting fails**
* renders error message

**post succesfully**
* renders tsk
* clears tsk input

#### PUT tsk

**cannot unexistent tsk**
* renders "cannot unexistent tsk"

**when puting**
- calls PUT tsk api
- renders loading

**put succesfully**

*put doing tsk*
* renders tsk

*put done tsk*
* renders tsk

*put tsk content*
- renders tsk

#### DELETE tsk

**when deleting**
* renders loading
- calls DELETE tsk api

**when deleting fails**
* renders error message

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

### services

#### signUpUser

**calls signin api**
- calls POST /v1/signup endpoint with received credentials

**when request is succesfull**
* returns ok
* returns data containing user
* returns data containing auth_token
* returns is ready

**when request is failed**
* returns not ok
* returns error containing message

**when request breaks**
* returns not ok
* returns error containing message

**when request is loading**
* returns is not ready

#### signInUser

**calls signup api**
- calls POST /v1/signin endpoint with received credentials

**when request is succesfull**
* returns ok
* returns data containing user
* returns data containing auth_token
* returns is ready

**when request is failed**
* returns not ok
* returns error containing message

**when request breaks**
* returns not ok
* returns error containing message

**when request is loading**
* returns is not ready

#### getTsks

**calls get tsks api**
* calls GET /v1/tsks endpoint with auth token

**when request is succesfull**
* returns ok
* returns data containing tsks

**when request is failed**
* returns not ok
* returns error containing message

**when request breaks**
- returns not ok
- returns error containing message

#### postTsk

**calls post tsk api**
* calls POST /v1/tsks endpoint with auth token and tsk

**when request is succesfull**
* returns ok
* returns data containing tsk
* returns is ready

**when request is failed**
* returns not ok
* returns error containing message

**when request breaks**
- returns not ok
- returns error containing message

**when request is loading**
* returns not ready

#### putTskToDoing

**calls put tsk api**
- calls PUT /v1/tsks/:id endpoint with auth token and tsk status

**when request is succesfull**
- returns ok
- returns data containing tsk

**when request is failed**
- returns not ok
- returns error containing message

**when request breaks**
- returns not ok
- returns error containing message

#### putTskToDone

**calls put tsk api**
- calls PUT /v1/tsks/:id endpoint with auth token and tsk status

**when request is succesfull**
- returns ok
- returns data containing tsk

**when request is failed**
- returns not ok
- returns error containing message

**when request breaks**
- returns not ok
- returns error containing message

#### deleteTsk

**calls delete tsk api**
* calls DELETE /v1/tsks/:id endpoint with auth token

**when request is succesfull**
* returns ok

**when request is failed**
* returns not ok
* returns error containing message

**when request breaks**
* returns not ok
* returns error containing message

