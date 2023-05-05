# tsks-api

Project under development with studies purposes only. Currently learning
fundamentals of rails modeling and testing and planning deployment pipelines as
next steps.

[![build](https://app.travis-ci.com/luanrv/tsks-api.svg?branch=main)](https://app.travis-ci.com/luanrv/tsks-api)

## Resources and endpoints

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
      "id": 1,
      "tsk": "t",
      "context": "inbox",
      "status": "todo/doing/done",
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
  "ok": true,
  "tsk": {
    "id": 1,
    "tsk": "t",
    "context": "inbox",
    "status": "todo/doing/done",
    "created_at": "<date>",
    "updated_at": "<date>"
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
    "id": 1,
    "tsk": "t",
    "context": "inbox",
    "status": "todo/doing/done",
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
  "email": "<any>",
  "password": "<any>"
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
    "email": "<any>",
    "auth_token": "<any>",
    "created_at": "<date>",
    "updated_at": "<date>"
  }
}
```

#### `POST /signin`

**Body:**

```json
{
  "email": "<any>",
  "password": "<any>"
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
    "email": "<any>",
    "auth_token": "<any>",
    "created_at": "<date>",
    "updated_at": "<date>"
  }
}
```

### Errors Responses

##### `400 Bad Request`

```json
{
  "ok": false,
  "message": "400 Bad Request",
}
```

##### `401 Unauthorized`

```json
{
  "ok": false,
  "message": "401 Unauthorized",
}
```

##### `403 Forbidden`

```json
{
  "ok": false,
  "message": "403 Forbidden",
}
```

##### `404 Not Found`

```json
{
  "ok": false,
  "message": "404 Not Found",
}
```

##### `409 Conflict`

```json
{
  "ok": false,
  "message": "409 Conflict",
}
```

##### `422 Unprocessable Entity`

```json
{
  "ok": false,
  "message": "422 Unprocessable Entity",
}
```

##### `500 Server Error`

```json
{
  "ok": false,
  "message": "500 Server Error",
}
```

## Development

**Starting dev server:**

```
./bin/up
```

**Running end to end tests:** (_Need server started_)

```
./bin/test
```

**Obs.:** after testing run `./bin/stop` to put svc and test containers down.
