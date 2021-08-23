# tsks-api

## Resources and endpoints

### `tsks`

**Headers:**

```json
{
  "authorization": "Bearer <token>",
  "content-type": "application/json"
}

```

_Required for all tsks endpoints._

#### `GET /tsks`

**Responses:**

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

##### `401`

```json
{
  "ok": false,
  "message": "401 Unauthorized"
}
```

#### `POST /tsks`

**Body:**

```json
{
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

##### `201`

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

##### `401`

```json
{
  "ok": false,
  "message": "401 Unauthorized"
}
```

##### `400`

```json
{
  "ok": false,
  "message": "400 Bad request"
}
```

#### `DELETE /tsks/:id`

**Params**

```
id = tsk_id
```

**Responses:**

##### `203`

```json
{
  "ok": true
}
```

##### `401`

```json
{
  "ok": false,
  "message": "401 Unauthorized"
}
```

##### `400`

```json
{
  "ok": false,
  "message": "400 Bad request"
}
```

### `user` (Signup/Signin)

**Headers:**

```json
{
  "content-type": "application/json"
}
```

_Required for all endpoints._

#### `POST /register`

**Body:**

```json
{
  "email": "<any>",
  "password": "<any>",
}
```

**Responses:**

##### `201`

```json
{
  "ok": true,
  "token": "<any>",
  "user_id": "<any>",
}
```

##### `409`

```json
{
  "ok": false,
  "message": "E-mail already registered",
}
```

#### `POST /login`

**Body:**

```json
{
  "email": "<any>",
  "password": "<any>",
}
```

**Responses:**

##### `200`

```json
{
  "ok": true,
  "token": "<any>",
  "user_id": "<any>",
}
```

##### `403`

```json
{
  "ok": false,
  "message": "Permission denied",
}
```


## Development

**Starting the server:**

```
docker-compose up
```

**Running e2e tests:**

```
docker-compose run web spec
```

**Obs.:** After each of the commands above, run `docker-compose down` to put all containers down.
