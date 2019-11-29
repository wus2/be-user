TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNlcm5hbWUiOiJhbnZoIiwiaWF0IjoxNTc1MDQwOTUzfQ.tpxjPzDFvuIObsb7gtnVhoI2hdPT9FTDCGNy1hhM04I"

curl-login:
	curl --header "Content-Type: application/json" \
	--request POST \
  	--data '{"username":"anvh","password":"123"}' \
  	http://localhost:55210/users/login
	
curl-register:
	curl --header "Content-Type: application/json" \
	--request POST \
  	--data '{"username":"anvh","password":"123", "email":"anvh@gmail.com","address":"TPHCM","name":"An","phone":"123456","dob":"1998-10-21","cardID":"123456","gender":"Nam","avatar":"http://localhost:55210/public/default-avatar","role":"1"}' \
  	http://localhost:55210/users/register

curl-profile:
	curl -H 'Accept: application/json' -H "Authorization: Bearer ${TOKEN}" http://localhost:55210/users/profile

curl-update: 
	curl --header "Content-Type: application/json" \
	--request POST \
  	--data '{"id":"1", "username":"anvh","password":"123", "email":"anvh@gmail.com","address":"TPHCM","name":"An","phone":"123456","dob":"1998-10-21","cardID":"123456","gender":"Nam","avatar":"http://localhost:55210/public/default-avatar","role":"2"}' \
  	http://localhost:55210/users/update

deploy:
