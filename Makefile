TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNlcm5hbWUiOiJhbnZoIiwiaWF0IjoxNTc1MDQwOTUzfQ.tpxjPzDFvuIObsb7gtnVhoI2hdPT9FTDCGNy1hhM04I"
DOMAIN-HOST = "https://wusbeuser.herokuapp.com"
DOMAIN-LOCAL = http://localhost:55210
	
curl-register:
	curl --header "Content-Type: application/json" \
	--request POST \
  	--data '{"username":"anvh","password":"123", "email":"anvh@gmail.com","address":"TPHCM","name":"An","phone":"123456","dob":"1998-10-21","cardID":"123456","gender":"Nam","avatar":"http://localhost:55210/public/default-avatar","role":"1"}' \
  	${DOMAIN-LOCAL}/users/register

curl-login:
	curl --header "Content-Type: application/json" \
	--request POST \
  	--data '{"username":"anvh","password":"123"}' \
  	${DOMAIN-LOCAL}/users/login

curl-profile:
	curl -H 'Accept: application/json' -H "Authorization: Bearer ${TOKEN}" \
	--request GET \
	${DOMAIN-LOCAL}/users/profile

curl-update-profile: 
	curl -H 'Content-Type: application/json' -H "Authorization: Bearer ${TOKEN}" \
	--request POST \
	--data '{"address":"Nha Be - TPHCM","name":"An","phone":"123456","dob":"1998-10-21","gender":"Nam","avatar":"http://localhost:55210/public/default-avatar"}' \
   ${DOMAIN-LOCAL}/users/updateProfile

curl-update-password: 
	curl -H 'Content-Type: application/json' -H "Authorization: Bearer ${TOKEN}" \
	--request POST \
	--data '{"password":"123456"}' \
   ${DOMAIN-LOCAL}/users/updatePassword

curl: curl-register curl-login curl-profile curl-update-profile curl-update-password

deploy:
	git push heroku master
	heroku restart

logs: 
	heroku logs --tail
	# log live: -t
	# log n row: -n 1000