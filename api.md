# tsks-api

## FEATURES

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
- cannot without saved authentication token
- signin succesfully

### GET tsks
- cannot without authentication token
- cannot without valid authentication token
- get succesfully

### POST tsk
- cannot without authentication token
- cannot without valid authentication token
- cannot without tsk
- cannot without valid tsk
- post succesfully

### PUT tsk
- cannot without authentication token
- cannot without valid authentication token
- cannot without tsk
- cannot without valid tsk
- cannot unexistent tsk
- put succesfully

### DELETE tsk
- cannot without authentication token
- cannot without valid authentication token
- cannot without valid id
- delete succesfully

### errors possibilities
- 400
- 401
- 403
- 404
- 500

---

## ENDPOINTS

### `user` (Signup/Signin)

**Headers:** (_Required for all requests._)

```json
{
  "content-type": "application/json"
}
```

#### `POST /signup`

**Body:**

```json
{
  "email": "<email>",
  "password": "<pass>"
}
```

**Responses:**

##### Errors `400` `409` `422`

##### Success `201`

```json
{
  "ok": true,
  "user": {
    "id": 0,
    "email": "<email>",
    "auth_token": "<token>",
    "created_at": "<date>",
    "updated_at": "<date>"
  }
}
```

#### `POST /signin`

**Body:**

```json
{
  "email": "<email>",
  "password": "<pass>"
}
```

**Responses:**

##### Errors `400` `404` `403` `422`

##### Success `200`

```json
{
  "ok": true,
  "user": {
    "id": 0,
    "email": "<email>",
    "auth_token": "<token>",
    "created_at": "<date>",
    "updated_at": "<date>"
  }
}
```

### `tsks`

**Headers:** (_Required for all requests_)

```json
{
  "authorization": "Bearer <token>",
  "content-type": "application/json"
}
```

#### `GET /tsks`

**Responses:**

##### Errors `401` `403`

##### Success `200`

```json
{
  "ok": true,
  "tsks": [
    {
      "id": 0,
      "tsk": "<t>",
      "context": "<ctx>",
      "status": "todo|doing|done",
      "created_at": "<date>",
      "updated_at": "<date>"
    }
  ]
}
```

#### `POST /tsks`

**Body:**

```json
{
  "tsk": {
    "tsk": "<t>",
    "context": "<ctx>",
    "status": "todo|doing|done"
  }
}
```

**Responses:**

##### Errors `400` `401` `403` `422`

##### Success `201`

```json
{
  "ok": true,
  "tsk": {
    "id": 0,
    "tsk": "<t>",
    "context": "<ctx>",
    "status": "todo|doing|done",
    "created_at": "<date>",
    "updated_at": "<date>"
  }
}
```

#### `PUT /tsks`

**Body:**

```json
{
  "tsk": {
    "tsk": "<t>",
    "context": "<ctx>",
    "status": "todo|doing|done"
  }
}
```

**Responses:**

##### Errors `400` `401` `403` `422`

##### Success `200`

```json
{
  "ok": true,
  "tsk": {
    "id": 0,
    "tsk": "<t>",
    "context": "<ctx>",
    "status": "todo|doing|done",
    "created_at": "<date>",
    "updated_at": "<date>"
  }
}
```

#### `DELETE /tsks/:id`

**Responses:**

##### Errors `401` `403` `404`

##### Success `204`

<hr/>

### Errors Responses

##### `400 Bad Request`

```json
{
  "ok": false,
  "message": "400 Bad Request",
  "status_code": 400
}
```

##### `401 Unauthorized`

```json
{
  "ok": false,
  "message": "401 Unauthorized",
  "status_code": 401
}
```

##### `403 Forbidden`

```json
{
  "ok": false,
  "message": "403 Forbidden",
  "status_code": 403
}
```

##### `404 Not Found`

```json
{
  "ok": false,
  "message": "404 Not Found",
  "status_code": 404
}
```

##### `409 Conflict`

```json
{
  "ok": false,
  "message": "409 Conflict",
  "status_code": 409
}
```

##### `422 Unprocessable Entity`

```json
{
  "ok": false,
  "message": "422 Unprocessable Entity",
  "status_code": 422
}
```

##### `500 Server Error`

```json
{
  "ok": false,
  "message": "500 Server Error",
  "status_code": 500
}
```