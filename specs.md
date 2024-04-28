# tsks tests cases

## API

### signup

**cannot without email**
- returns status_code=400
- returns message="400 Bad Request"
- returns ok=false

**cannot without password**
- returns status_code=400
- returns message="400 Bad Request"
- returns ok=false

**cannot without valid email**
- returns status_code=400
- returns message="400 Bad Request"
- returns ok=false

**cannot with already registered email**
- returns status_code=409
- returns message="409 Conflict"
- returns ok=false

**signup succesfully**
- returns status_code=201
- returns message="201 Created"
- returns ok=true
- saves authentication token
- returns user

### signin

**cannot without email**
- returns status_code=400
- returns message="400 Bad Request"
- returns ok=false

**cannot without valid email**
- returns status_code=400
- returns message="400 Bad Request"
- returns ok=false

**cannot without registered email**
- returns status_code=404
- returns message="404 Not Found"
- returns ok=false

**cannot without password**
- returns status_code=400
- returns message="400 Bad Request"
- returns ok=false

**cannot without correct password**
- returns status_code=401
- returns message="401 Unauthorized"
- returns ok=false

**cannot without saved authentication token**
- returns status_code=500
- returns message="500 Internal Server Error"
- returns ok=false

**signin succesfully**
- returns status_code=200
- returns message="200 Success"
- returns ok=true
- returns user

### GET tsks

**cannot without authentication token**
- returns status_code=401
- returns message="401 Unauthorized"
- returns ok=false

**cannot without valid authentication token**
- returns status_code=403
- returns message="403 Forbidden"
- returns ok=false

**get succesfully**
- returns status_code=200
- returns message="200 Success"
- returns ok=true
- returns tsks

### POST tsk

**cannot without authentication token**
- returns status_code=401
- returns message="401 Unauthorized"
- returns ok=false

**cannot without valid authentication token**
- returns status_code=403
- returns message="403 Forbidden"
- returns ok=false

**cannot without tsk**
- returns status_code=400
- returns message="400 Bad Request"
- returns ok=false

**cannot without valid tsk**
- returns status_code=400
- returns message="400 Bad Request"
- returns ok=false

**post succesfully**
- returns status_code=201
- returns message="201 Created"
- returns ok=true
- returns tsks

### PUT tsk

**cannot without authentication token**
- returns status_code=401
- returns message="401 Unauthorized"
- returns ok=false

**cannot without valid authentication token**
- returns status_code=403
- returns message="403 Forbidden"
- returns ok=false

**cannot without tsk**
- returns status_code=400
- returns message="400 Bad Request"
- returns ok=false

**cannot without valid tsk**
- returns status_code=400
- returns message="400 Bad Request"
- returns ok=false

**cannot unexistent tsk**
- returns status_code=404
- returns message="404 Not Found"
- returns ok=false

**put succesfully**
- returns status_code=200
- returns message="200 Success"
- returns ok=true
- returns tsk

### DELETE tsk

**cannot without authentication token**
- returns status_code=401
- returns message="401 Unauthorized"
- returns ok=false

**cannot without valid authentication token**
- returns status_code=403
- returns message="403 Forbidden"
- returns ok=false

**cannot without valid id**
- returns status_code=400
- returns message="400 Bad Request"
- returns ok=false

**cannot unexistent tsk**
- returns status_code=404
- returns message="404 Not Found"
- returns ok=false

**delete succesfully**
- returns status_code=204

---

## WEB

### home

**when has session**
- redirects to tsks

**when has not session**
- redirects to signin

### signup

**cannot without email**
- renders "required"

**cannot without password**
- renders "required"

**cannot without valid email**
- renders "invalid email"

**cannot without unregistered email**
- renders "email already registered"

**signup succesfully**
- saves user on localStorage
- redirects to /tsks

### signin

**cannot without email**
- renders "required"

**cannot without valid email**
- renders "invalid email"

**cannot without registered email**
- renders "email not registered"

**cannot without password**
- renders "required"

**cannot without correct password**
- renders "incorrect password"

**signin succesfully**
- saves user on localStorage
- redirects to /tsks

### tsks

**cannot without authentication token**
- redirects to /signin

**cannot without valid authentication token**
- redirects to /signin

#### GET tsks

**get succesfully**

*when has tsk*
- renders tsk
- renders context

*when has not tsk*
- renders "tsks not found"

#### POST tsk

**cannot without tsk**
- renders "cannot without tsk"

**post succesfully**
- renders tsk

#### PUT tsk

**cannot unexistent tsk**
- renders "cannot unexistent tsk"

**put succesfully**

*put doing tsk*
- renders tsk

*put done tsk*
- renders tsk

*put tsk content*
- renders tsk

#### DELETE tsk

**cannot unexistent tsk**
- renders "cannot unexistent tsk"

**delete succesfully**
- renders "deleted succesfully"
- remove tsk from render