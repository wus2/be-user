TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MzUsInVzZXJuYW1lIjoiYW52aDIiLCJyb2xlIjoxLCJpYXQiOjE1NzU5MDY0MTV9.8eOwWllg2lGwzm0Ju8_XPy0ro2-vPDHRdsC3o9YMHs8"
TOKEN-ADMIN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NDQsInVzZXJuYW1lIjoiZmFjZWJvb2tfMTEyNjc1MzA5NDE4NzAwNyIsImlhdCI6MTU3NTkxMTA4Mn0.jqip_3aWe8QsVFbHF7jp-d-hTwQunlSX8jjvqDnyw4g"
DOMAIN-x = "https://wusbeuser.herokuapp.com"
DOMAIN = http://localhost:55210
	
curl-register:
	curl --header "Content-Type: application/json" \
	--request POST \
  	--data '{"username":"anvh2","password":"123", "email":"anvo.ht209@gmail.com","address":"TPHCM","name":"An","phone":"123456","dob":"1998-10-21","cardID":"1234567","gender":"Nam","avatar":"http://localhost:55210/public/default-avatar","role":"1"}' \
  	${DOMAIN}/users/register

curl-login:
	curl --header "Content-Type: application/json" \
	--request POST \
  	--data '{"username":"anvh2","password":"123"}' \
  	${DOMAIN}/users/login

curl-profile:
	curl -H 'Accept: application/json' -H "Authorization: Bearer ${TOKEN}" \
	--request GET \
	${DOMAIN}/users/profile

curl-update-profile: 
	curl -H 'Content-Type: application/json' -H "Authorization: Bearer ${TOKEN}" \
	--request POST \
	--data '{"address":"Nha Be - TPHCM","name":"Vo Hoang An","phone":"123456","dob":"1998-10-21","gender":"Nam","avatar":"http://localhost:55210/public/default-avatar"}' \
   ${DOMAIN}/users/updateprofile

curl-update-password: 
	curl -H 'Content-Type: application/json' -H "Authorization: Bearer ${TOKEN}" \
	--request POST \
	--data '{"password":"123", "email":"anvo.ht209@gmail.com"}' \
   ${DOMAIN}/users/updatepassword

curl-update-avatar:
	curl -H 'Content-Type: application/json' -H "Authorization: Bearer ${TOKEN}" \
	--request POST \
   ${DOMAIN}/users/updateavatar

curl-tutor-update-skill:
	curl -H 'Content-Type: application/json' -H "Authorization: Bearer ${TOKEN}" \
	--request PUT \
	--data '{"skills":["english", "math"]}' \
   ${DOMAIN}/tutor/updateskills

curl-tutor-update-intro:
	curl -H 'Content-Type: application/json' -H "Authorization: Bearer ${TOKEN}" \
	--request PUT \
	--data '{"introDesc":"Toi day Toan, Anh, Ly va Hoa"}' \
   ${DOMAIN}/tutor/updateintro

curl-tutor-profile: 
	curl -H 'Accept: application/json' \
	--request GET \
	${DOMAIN}/tutor/getprofile/35

curl-tutor-getlist:
	curl ${DOMAIN}/tutor/getlist/offset/1/limit/2

curl-admin-getusers:
	curl -H "Authorization: Bearer ${TOKEN-ADMIN}" \
	${DOMAIN}/admin/getusers/offset/1/limit/2

curl: curl-register curl-login curl-profile curl-update-profile curl-update-password

deploy:
	git push heroku master

logs: 
	heroku logs --tail
	# log live: -t
	# log n row: -n 1000

restart:
	heroku restart

config-mysql: 
	heroku config:add DATABASE_URL=mysql://bVEtH8m4Ur:KEWYT2ZMYS@remotemysql.com/bVEtH8m4Ur?reconnect=true --app wusbeuser

config-store-statis-file:
	heroku config:set AWS_ACCESS_KEY_ID=AKIAIOORY2XBIUSD26KQ AWS_SECRET_ACCESS_KEY=G3POQ422LWK6R56AJ5EE6QFOV4MARC7R
