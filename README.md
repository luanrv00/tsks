# tsks-api

[![build](https://app.travis-ci.com/luanramosvicente/tsks-api.svg?branch=main)](https://travis-ci.com/luanrvmood/tsks-api)

## Resources and endpoints

### `tsks`

**Headers:**

_Required for all tsks endpoints._

```json
{
  "authorization": "Bearer <token>",
  "content-type": "application/json"
}
```

#### `GET /tsks`

**Responses:**

##### Errors `401` `403`

##### `200`

```json
{
  "ok": true,
  "tsks": [
    {
      "id": 1,
      "tsk": "t",
      "context": "Inbox",
      "done": 0,
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
  "tsks": [
    {
      "id": 1,
      "tsk": "t",
      "context": "Inbox",
      "done": 0,
      "created_at": "<date>",
      "updated_at": "<date>"
    }
  ]
}
```

**Responses:**

##### Errors `400` `401` `403`

##### `201`

```json
{
  "ok": true,
  "tsk": {
    "id": 1,
    "tsk": "t",
    "context": "Inbox",
    "done": 0,
    "created_at": "<date>",
    "updated_at": "<date>"
  }
}
```

#### `DELETE /tsks/:id`

**Responses:**

##### Errors `401` `403`

##### `204`

<hr/>

### `user` (Signup/Signin)

**Headers:**

_Required for all endpoints._

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

##### Errors `400` `409`

##### `201`

```json
{
  "ok": true,
  "auth_token": "<any>",
  "user": {
    "id": 0,
    "email": "<any>",
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

##### Errors `400` `401` `403`

##### `200`

```json
{
  "ok": true,
  "auth_token": "<any>",
  "user": {
    "id": 0,
    "email": "<any>",
    "created_at": "<date>",
    "updated_at": "<date>"
  }
}
```

## Development

**Starting the server:**

```
docker-compose up
```

**Running e2e tests:**

_Need server started._

```
docker-compose run api spec
```

**Obs.:** run `docker-compose down` to put each container down.
