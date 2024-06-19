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
* improve security against stolen tokens
  * make the auth token expirable after some time
  * remove auth token as a property of user
  * returns the auth token as a property of response
  * create a refresh token alongside with auth token for signup/signin
  * save refresh token on db
  * dont save auth token on db
  * extracts JWT utils for lib
    * write tests for JWT utils
  * returns the refresh token as http only cookie
    * fix error unitialized constant V1::RefreshTokenController
  * create refresh token endpoint for auth token renovation
  * updates auth token storage to outside user object
  * verify 401 errors for both scenarios:
    ! (maybe this never occurs) 401 without user existent on localStorage (redirects to signin)
    * 401 with expired auth token (request refresh token endpoint)
  * write tests for refresh token behavior (already documented)
  * fix PUT tsk cannot unexistent test failing
  * test integration of refresh token (webapp/api)
    * stolen auth token expires after 1minute
    * stolen refresh token returns 401 after expired
  * verify all endpoint if refresh_token is returned together with user
  * send auth token through cookies
    * remove auth_token as endpoints returns as json
    * update all necessary webapp's requests to send cookies (update fetch with credentials: 'include')
    * remove all Bearer tokens sent on api requests
* updates links to docs on api/web repositories
* create design style
* implements forms auto focus
  * move to invalid input when error "email not valid" occurs for signup/signin
* refactor current implementation
  * move signup api call to a separate module
  * move signin api call to a separate module
  * move tsks api calls to a separate module
* refactor tsk params when creating/updating (only tsk and context are necessary)
  * test integration
    * use DELETE /tsks/:id endpoint for deleting tsks
* clear ctx input after submiting a tsk
+ implements loading button
    * research loading icon for button
    * create LoadingButton
    * renders loading button for signup/signin
    + renders loading button for tsks
+ implements tests for api calls
+ implements user header
    * research apollo client/server possibility
- implements tsk edit
- changes all NEXT_PUBLIC_TSKS_LOCAL_STORAGE_KEY to NEXT_PUBLIC_USER_LOCAL_STORAGE_KEY
  ! write specs for cli implementation
