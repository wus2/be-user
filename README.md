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
  - Profile:
    + Path: /users/profile
    + Method: GET
    + Header: 
      "Content-Type": "application/json"
      "Authorization": "Bearer ${JWT-TOKEN}"
  - Update:
    + Path: /users/update
    + Method: POST
    + Header: 
      "Content-Type": "application/json"
      "Authorization": "Bearer ${JWT-TOKEN}"
    + Body: 
      {
      "id": int,
      "password":"string",
      "address":"string",
      "name":"string",
      "phone":"string",
      "dob":"yyy-mm-dd",
      "cardID":"string",
      "gender":"string",
      "avatar":"string",
      "role": int
      }
