Backend User Manage

1. Domain: https://wusbeuser.herokuapp.com/
2. API:
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
    + Path: /users/updateProfile
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
    + Path: /users/updatePassword
    + Method: POST
    + Header: 
      "Content-Type": "application/json"
      "Authorization": "Bearer ${JWT-TOKEN}"
    + Body: 
      {
      "password":"string"
      }
