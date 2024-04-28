# tsks-web

## FEATURES

### home

- when has session redirects to tsks
- when has not session redirects to signin

### signup

- cannot without email
- cannot without password
- cannot without valid email
- cannot without unregistered email
- signup succesfully

### signin

- cannot without email
- cannot without valid email
- cannot without registered email
- cannot without password
- cannot without correct password
- signin succesfully

### tsks

- cannot access without authentication token
- cannot access without valid authentication token

#### GET tsks

**get succesfully**
- when has tsk
- when has not tsk

#### POST tsk

- cannot without tsk
- post succesfully

#### PUT tsk

- cannot unexistent tsk

**put succesfully**
- put doing tsk
- put done tsk
- put tsk content

#### DELETE tsk

- cannot unexistent tsk
- delete succesfully

### errors possibilities

- 400
- 401
- 403
- 404
- 500