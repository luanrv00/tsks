# tsks-web

Project under development with studies purposes only. 
Currently learning fundamentals of react ecosystem and testing and planning deployment pipelines as next steps.

## Development

Using `yarn` to install development dependencies should enable to local
development. The file `package.json` contains some npm scripts to start server
and run tasks.

## Troubleshooting

**When running e2e tests on WSL 2**

`Cypress: error while loading shared libraries: libgtk-3.so.0: cannot open
shared object file: No such file or directory`

**Solution:**

```
sudo apt install -y libgtk2.0-0 libgtk-3-0 libgbm-dev libnotify-dev libgconf-2-4 libnss3 libxss1 libasound2 libxtst6 xauth xvfb
```
