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
- when signing up
- when signing up fails
* signup succesfully
* renders a link to signin

### signin

* cannot without email
* cannot without valid email
* cannot without registered email
* cannot without password
* cannot without correct password
- when signing in
- when signing in fails
* signin succesfully
* renders a link to signup

### refresh token

* when refresh token is not valid
* when refresh token is unauthorized
* when refresh token owner is not found
- when refreshing token
- when refreshing token fails
* refresh token succesfully

### tsks

* cannot without authentication token

**cannot without valid authentication token**
* when unauthorized
* when forbidden

- access succesfully

#### GET tsks

- when getting
* get succesfully

#### POST tsk

**cannot without valid authentication token**
* when unauthorized

- when posting
* cannot without tsk
* post succesfully

#### PUT tsk

**cannot without valid authentication token**
* when unauthorized

* cannot unexistent tsk
- when puting
* put succesfully
* put doing tsk
* put done tsk
- put tsk content

#### DELETE tsk

**cannot without valid authentication token**
* when unauthorized

- when deleting
* delete succesfully

#### renders tsk

* renders tsk
* renders context
* renders status


### services

#### signUpUser
- calls signin api

#### signInUser
- calls signup api

#### getTsks
- calls get tsks api

#### postTsk
- calls post tsk api

#### putTskToDoing
- calls put tsk api

#### putTskToDone
- calls put tsk api

#### deleteTsk
- calls delete tsk api

### errors possibilities

- 400
- 401
- 403
- 404
- 500
