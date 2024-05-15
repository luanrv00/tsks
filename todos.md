# TODOS

* review tsks specs and implementation (GET, POST, DELETE)
* write tsks specs for PUT implementation
* fix POST test using GET method
* review tsks specs and implementation for signup/signin (webapp)
* review tsks specs and implementation for tsks GET/POST (webapp)
* write tests for tsks PUT implementation (webapp)
* verify why containers are created each time it is started (for api)
* verify why containers are duplicated each time it is started (for web tests)
* write implementation for tsks DELETE (webapp)
    * add column deleted_at (tsks-api)
    * make a PUT request when deleting a tsk with deleted_at as the current time
    * fix not fetching tsks after deleting where there is only one
    * verify why when deleting a tsk it is making PUT twice
* fix POST succesfully test
* clear input after entering new tsk
* when accessing /tsks after rebuilding api/web, 403 is not redirecting to /signin
    * remove localstorage info when 403
* add link to signin on signup page
* write scripts for lint and unit testing using docker compose
- fix unit test failing (styles importing/parsing error)
- setup CI/CD environments on github for tsks repositories
- implements tsk edit (webapp)
    - create issue describing this
- write specs for cli implementation