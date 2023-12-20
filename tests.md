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

**signin succesfully**
- returns status_code=200
- returns message="200 Success"
- returns ok=true
- returns user

### `GET` tsks

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
- returns ok=true

---

## WEB

### signup

**cannot without email**
- renders "cannot without email"

**cannot without password**
- renders "cannot without password"

**cannot without valid email**
- renders "cannot without valid email"

**cannot with already registered email**
- renders "cannot with already registered email"

**signup succesfully**
- renders "signup succesfully"
- redirects to /tsks

### signin

**cannot without email**
- renders "cannot without email"

**cannot without valid email**
- renders "cannot without valid email"

**cannot without registered email**
- renders "cannot without registered email"

**cannot without password**
- renders "cannot without password"

**cannot without correct password**
- renders "cannot without correct password"

**signin succesfully**
- renders "signin succesfully"
- redirects to /tsks

### GET tsks

**cannot without authentication token**
- redirects to /signin
- renders "cannot without authentication token"

**cannot without valid authentication token**
- redirects to /signin
- renders "cannot without valid authentication token"

**get succesfully**
- renders tsks

### POST tsk

**cannot without authentication token**
- redirects to /signin
- renders "cannot without authentication token"

**cannot without valid authentication token**
- redirects to /signin
- renders "cannot without valid authentication token"

**cannot without tsk**
- renders "cannot without tsk"

**cannot without valid tsk**
- renders "cannot without valid tsk"

**post succesfully**
- renders "post succesfully"
- renders tsk

### PUT tsk

**cannot without authentication token**
- redirects to /signin
- renders "cannot without authentication token"

**cannot without valid authentication token**
- redirects to /signin
- renders "cannot without valid authentication token"

**cannot without tsk**
- renders "cannot without tsk"

**cannot without valid tsk**
- renders "cannot without valid tsk"

**cannot unexistent tsk**
- renders "cannot unexistent tsk"

**put succesfully**
- renders "put succesfully"
- renders tsk

### DELETE tsk

**cannot without authentication token**
- redirects to /signin
- renders "cannot without authentication token"

**cannot without valid authentication token**
- redirects to /signin
- renders "cannot without valid authentication token"

**cannot without valid id**
- renders "cannot without valid id"

**cannot unexistent tsk**
- renders "cannot unexistent tsk"

**delete succesfully**
- renders "deleted succesfully"
- remove tsk from render