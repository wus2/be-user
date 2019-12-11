Backend User Manage

1. Domain: https://wusbeuser.herokuapp.com/
2. API-USER:
  - Login: 
    + Path: /users/login
    + Method: POST
    + Header: "Content-Type": "application/json"
    + Body: 
      {
      "username":"string",
      "password":"string"
      }
  - Regiter:
    + Path: /users/register
    + Method: POST
    + Header: "Content-Type": "application/json"
    + Body: 
      {
      "username":"string",
      "password":"string",
      "email":"string",
      "address":"string",
      "name":"string",
      "phone":"string",
      "dob":"yyy-mm-dd",
      "cardID":"string",
      "gender":"string",
      "avatar":"string",
      "role": int
      }
  - Get Profile:
    + Path: /users/profile
    + Method: GET
    + Header: 
      "Content-Type": "application/json"
      "Authorization": "Bearer ${JWT-TOKEN}"
  - Update Profile:
    + Path: /users/updateprofile
    + Method: POST
    + Header: 
      "Content-Type": "application/json"
      "Authorization": "Bearer ${JWT-TOKEN}"
    + Body: 
      {
      "address":"string",
      "name":"string",
      "phone":"string",
      "dob":"yyy-mm-dd",
      "gender":"string",
      "avatar":"string",
      }
  - Update Password:
    + Path: /users/updatepassword
    + Method: POST
    + Header: 
      "Content-Type": "application/json"
      "Authorization": "Bearer ${JWT-TOKEN}"
    + Body: 
      {
      "email":"string",
      "password":"string"
      }
  - Update avatar:
    + Fullpath: https://wusbeuser.herokuapp.com/users/updateavatar
    + Method: POST
    + Header: 
      "Authorization": "Bearer ${JWT-TOKEN}"
    + Name input: <input name="avatar"/>
3. API-TUTOR
  - Update profile: user's feature
  - Update avatar: user's feature
  - Update tag skill:
    + Path: /tutor/updateskills
    + Method: POST
    + Header: 
      "Content-Type": "application/json"
      "Authorization": "Bearer ${JWT-TOKEN}"
    + Body:
      {
      "skills":["tag1", "tag2"]
      }
  - Update tutor introduction:
    + Path: /tutor/updateintro
    + Method: PUT
    + Header: 
      "Content-Type": "application/json"
      "Authorization": "Bearer ${JWT-TOKEN}"
    + Body: 
      {
      "introDesc":"string"
      }
4. API-USER:
  - Get list tutors:
    + Path: tutor/getlist/offset/:offset/limit/:limit
    + Method: GET
    + Header: 
      'Accept: application/json'
  - Get list tutors with filter:
  
  - Get tutor's profile:
    + Path: /tutor/getprofile/:tutorID
    + Method: GET
    + Header: 
      'Accept: application/json'
5. API-ADMIN:
  - Get list skills:
    + Path: /admin/skills/offset/:offset/limit/:limit
    + Method: GET
    + Header: 
      'Accept: application/json'
      "Authorization": "Bearer ${ADMIN-JWT-TOKEN}"
  - Get skill:
    + Path: /admin/getskill/:skillID
    + Method: GET
    + Header: 
      'Accept: application/json'
      "Authorization": "Bearer ${ADMIN-JWT-TOKEN}"
- Get add skill:
    + Path: /admin/addskill
    + Method: GET
    + Header: 
      'Accept: application/json'
      "Authorization": "Bearer ${ADMIN-JWT-TOKEN}"
    + Body: 
      {
      "skill":"string",
      "desc":"string",
      "image":"string"
      }
- Get update skill:
    + Path: /admin/updateskill
    + Method: PUT
    + Header: 
      'Accept: application/json'
      "Authorization": "Bearer ${ADMIN-JWT-TOKEN}"
    + Body: 
      {
      "skillID":int,
      "skill":"string",
      "desc":"string",
      "image":"string"
      }
- Get add skill:
    + Path: /admin/removeskill/:skillID
    + Method: GET
    + Header: 
      'Accept: application/json'
      "Authorization": "Bearer ${ADMIN-JWT-TOKEN}"
  - Get list user:
    + Path: /admin/getlist/offset/:offset/limit/:limit
    + Method: GET
    + Header: 
      'Accept: application/json'
      "Authorization": "Bearer ${ADMIN-JWT-TOKEN}"
- Get user profile:
    + Path: /admin/user/:uid
    + Method: GET
    + Header: 
      'Accept: application/json'
      "Authorization": "Bearer ${ADMIN-JWT-TOKEN}"