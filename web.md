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

- get succesfully

#### POST tsk

- cannot without tsk
- post succesfully

#### PUT tsk

- cannot without tsk
- cannot without valid tsk
- cannot unexistent tsk
- put succesfully

#### DELETE tsk

- cannot without valid id
- cannot unexistent tsk
- delete succesfully

### errors possibilities

- 400
- 401
- 403
- 404
- 500