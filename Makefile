TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MzUsInVzZXJuYW1lIjoiYW52aDIiLCJyb2xlIjoxLCJpYXQiOjE1NzYzMzk2Mjl9.xP4iB5gMxGuUWIxfaSEt6glzytIFxeGPqUk7SPJy3e4"
TOKEN-ADMIN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwidXNlcm5hbWUiOiJhbnZoIiwicm9sZSI6MjExMCwiaWF0IjoxNTc1OTY1Njg3fQ.bjxBgf7oTIc3-RBWA8K9KKj_HuTajYzmB1s9O_1FftU"
DOMAIN = https://wusbeuser.herokuapp.com
DOMAIN-x = http://localhost:55210
	
curl-register:
	curl --header "Content-Type: application/json" \
	--request POST \
  	--data '{"username":"anvh4","password":"123", "email":"anvo.ht209@gmail.com","address":"TPHCM","name":"An","phone":"123456","dob":"1998-10-21","cardID":"1234567","gender":"Nam","avatar":"http://localhost:55210/public/default-avatar","role":"1"}' \
  	${DOMAIN}/user/register

curl-login:
	curl --header "Content-Type: application/json" \
	--request POST \
  	--data '{"username":"anvh2","password":"123"}' \
  	${DOMAIN}/user/login

curl-profile:
	curl -H 'Accept: application/json' -H "Authorization: Bearer ${TOKEN}" \
	--request GET \
	${DOMAIN}/user/profile

curl-update-profile: 
	curl -H 'Content-Type: application/json' -H "Authorization: Bearer ${TOKEN}" \
	--request POST \
	--data '{"address":"Nha Be - TPHCM","name":"Vo Hoang An","phone":"123456","dob":"1998-10-21","gender":"Nam","avatar":"http://localhost:55210/public/default-avatar"}' \
   ${DOMAIN}/user/updateprofile

curl-update-password: 
	curl -H 'Content-Type: application/json' -H "Authorization: Bearer ${TOKEN}" \
	--request POST \
	--data '{"password":"123", "email":"anvo.ht209@gmail.com"}' \
   ${DOMAIN}/user/updatepassword

curl-update-avatar:
	curl -H 'Content-Type: application/json' -H "Authorization: Bearer ${TOKEN}" \
	--request POST \
   ${DOMAIN}/user/updateavatar

curl-tutor-update-skill:
	curl -H 'Content-Type: application/json' -H "Authorization: Bearer ${TOKEN}" \
	--request PUT \
	--data '{"skills":["IT"]}' \
   ${DOMAIN}/tutor/updateskills

curl-tutor-update-intro:
	curl -H 'Content-Type: application/json' -H "Authorization: Bearer ${TOKEN}" \
	--request PUT \
	--data '{"introDesc":"Toi day Toan va Hoa"}' \
   ${DOMAIN}/tutor/updateintro

curl-tutor-profile: 
	curl -H 'Accept: application/json' \
	--request GET \
	${DOMAIN}/tutor/getprofile/35

curl-tutor-getlist:
	curl ${DOMAIN}/tutor/getlist/offset/1/limit/2

curl-tutor-getallskills:
	curl -H 'Content-Type: application/json' -H "Authorization: Bearer ${TOKEN}" \
	--request GET \
   ${DOMAIN}/tutor/getallskills

curl-tutor-filter:
	curl -H 'Content-Type: application/json' -H "Authorization: Bearer ${TOKEN}" \
	--request GET \
	--data '{"district":"Quận 8"}' \
   ${DOMAIN}/tutor/filtertutor/offset/0/limit/2

curl-admin-getuser:
	curl -H "Authorization: Bearer ${TOKEN-ADMIN}" \
	${DOMAIN}/admin/getusers/offset/1/limit/2

curl-admin-userprofile:
	curl -H "Authorization: Bearer ${TOKEN-ADMIN}" \
	${DOMAIN}/admin/user/35

curl-admin-skills:
	curl -H "Authorization: Bearer ${TOKEN-ADMIN}" \
	${DOMAIN}/admin/skills/offset/0/limit/4

curl-admin-getskill:
	curl -H "Authorization: Bearer ${TOKEN-ADMIN}" \
	${DOMAIN}/admin/getskill/8

curl-admin-addskill:
	curl -H 'Content-Type: application/json' -H "Authorization: Bearer ${TOKEN-ADMIN}" \
	--request POST \
	--data '{"skill":"Chemistry"}' \
	${DOMAIN}/admin/addskill

curl-admin-updateskill:
	curl -H 'Content-Type: application/json' -H "Authorization: Bearer ${TOKEN-ADMIN}" \
	--request PUT \
	--data '{"skillID": 22, "skill": "France"}' \
	${DOMAIN}/admin/updateskill

curl-admin-removeskill:
	curl -H "Authorization: Bearer ${TOKEN-ADMIN}" \
	--request DELETE \
	${DOMAIN}/admin/removeskill/7

curl-admin-lock:
	curl -H 'Content-Type: application/json' -H "Authorization: Bearer ${TOKEN-ADMIN}" \
	--request PUT \
	${DOMAIN}/admin/blockuser/35

curl-admin-unlock:
	curl -H 'Content-Type: application/json' -H "Authorization: Bearer ${TOKEN-ADMIN}" \
	--request PUT \
	${DOMAIN}/admin/unblockuser/35

build:
	tsc

sync: 
	git add .
	git commit -m"compile to js"
	git push heroku master

deploy: build sync

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
