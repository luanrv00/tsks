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
* fix unit test failing (styles importing/parsing error)
* setup CI/CD environments on github for tsks repositories
* fix /tsks reloading like crazy
* updates delete tsk button style
- improve security against stolen tokens
    - make the auth token expirable after some time
    * remove auth token as a property of user
    * returns the auth token as a property of response
    * create a refresh token alongside with auth token for signup/signin
    * save refresh token on db
    * dont save auth token on db
    - returns the refresh token as http only cookie
    - create refresh token endpoint for auth token renovation
    - verify 401 errors for both scenarios:
        - 401 without user existent on localStorage (redirects to signin)
        - 401 with expired auth token (request refresh token endpoint)
- implements tsk edit
! write specs for cli implementation