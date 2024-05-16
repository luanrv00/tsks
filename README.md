# tsks-web

[![e2e tests](https://github.com/luanrv00/tsks-web/actions/workflows/e2e.yml/badge.svg)](https://github.com/luanrv00/tsks-web/actions/workflows/e2e.yml)
[![unit tests](https://github.com/luanrv00/tsks-web/actions/workflows/unit.yml/badge.svg)](https://github.com/luanrv00/tsks-web/actions/workflows/unit.yml)

## Development

**Starting dev server:**

```
./bin/dev
```

**Running end to end tests:**

```
./bin/test_e2e
```

**Running unit tests:** (_Need server started_)

```
./bin/test_unit
```

**Running linter:**

```
./bin/lint
```

**Obs.:** after testing run `./bin/stop` to put svc and test containers down.

## Troubleshooting

**When running e2e tests on WSL 2**

`Cypress: error while loading shared libraries: libgtk-3.so.0: cannot open
shared object file: No such file or directory`

**Solution:**

```
sudo apt install -y libgtk2.0-0 libgtk-3-0 libgbm-dev libnotify-dev libgconf-2-4 libnss3 libxss1 libasound2 libxtst6 xauth xvfb
```

### Docs

https://gist.github.com/luanrv/cd580adf5be96d9d2eecd6add1733322
