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
* when signing up
* when signing up fails
* signup succesfully
* renders a link to signin

### signin

* cannot without email
* cannot without valid email
* cannot without registered email
* cannot without password
* cannot without correct password
* when signing in
* when signing in fails
* signin succesfully
* renders a link to signup

### refresh token

* when refresh token is not valid
* when refresh token is unauthorized
* when refresh token owner is not found
* when refreshing token
* when refreshing token fails
* refresh token succesfully

### tsks

* cannot without authentication token

#### cannot without valid authentication token
* when unauthorized
* when forbidden

* access succesfully

#### GET tsks

* when getting
* when getting fails
* get succesfully

#### POST tsk

* when posting
* when posting fails
* cannot without tsk
* post succesfully

#### PUT tsk

* cannot unexistent tsk
- when puting
* put succesfully
* put doing tsk
* put done tsk
- put tsk content

#### DELETE tsk

##### cannot without valid authentication token
* when unauthorized

* when deleting
* when deleting fails
* delete succesfully

#### renders tsk

* renders tsk
* renders context
* renders status


### services

#### signUpUser
* calls signin api
* when request is succesfull
* when request is failed
* when request breaks
! when request is loading

#### signInUser
* calls signup api
* when request is succesfull
* when request is failed
* when request breaks
! when request is loading

#### getTsks
* calls get tsks api
* when request is succesfull
* when request is failed
* when request breaks

#### postTsk
* calls post tsk api
* when request is succesfull
* when request is failed
* when request breaks
* when request is loading

#### putTskToDoing
- calls put tsk api

#### putTskToDone
- calls put tsk api

#### deleteTsk
* calls delete tsk api
* when request is succesfull
* when request is failed
* when request breaks
* when request is loading

### errors possibilities

- 400
- 401
- 403
- 404
- 500
