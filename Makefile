TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MzUsInVzZXJuYW1lIjoiYW52aDIiLCJyb2xlIjoxLCJpYXQiOjE1NzYzMzk2Mjl9.xP4iB5gMxGuUWIxfaSEt6glzytIFxeGPqUk7SPJy3e4"
TOKEN-ADMIN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwidXNlcm5hbWUiOiJhbnZoIiwicm9sZSI6MjExMCwiaWF0IjoxNTc1OTY1Njg3fQ.bjxBgf7oTIc3-RBWA8K9KKj_HuTajYzmB1s9O_1FftU"
TOKEN-TUTEE = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NDksInVzZXJuYW1lIjoiYW52aDMiLCJyb2xlIjoyLCJpYXQiOjE1NzY5MzY0Nzd9.N8U-cmlUW2B7ccLQVYvLocxAoPy1hmyfmtaB9xJkklw"
DOMAIN-x = https://wusbeuser.herokuapp.com
DOMAIN = http://localhost:55210
	
curl-register:
	curl --header "Content-Type: application/json" \
	--request POST \
  	--data '{"username":"anvh5","password":"123", "email":"anvo.ht209@gmail.com","address":"TPHCM","name":"An","phone":"123456","dob":"1998-10-21","cardID":"1234567","gender":"Nam","avatar":"http://localhost:55210/public/default-avatar","role":"1"}' \
  	${DOMAIN}/user/register

curl-login:
	curl --header "Content-Type: application/json" \
	--request POST \
  	--data '{"username":"anvh3","password":"123"}' \
  	${DOMAIN}/user/login

curl-profile:
	curl -H 'Accept: application/json' -H "Authorization: Bearer ${TOKEN}" \
	--request GET \
	${DOMAIN}/user/profile

curl-update-profile: 
	curl -H 'Content-Type: application/json' -H "Authorization: Bearer ${TOKEN}" \
	--request POST \
	--data '{"address":"Phuoc Kien - Nha Be - TPHCM","name":"Vo Hoang An","phone":"123456","dob":"1998-10-21","gender":"Nam","avatar":"http://localhost:55210/public/default-avatar"}' \
   ${DOMAIN}/user/updateprofile

curl-update-password: 
	curl -H 'Content-Type: application/json' -H "Authorization: Bearer ${TOKEN}" \
	--request POST \
	--data '{"password":"1234", "email":"anvo.ht209@gmail.com"}' \
   ${DOMAIN}/user/updatepassword

curl-forgot-password: 
	curl -H 'Content-Type: application/json' \
	--request POST \
	--data '{"email":"anvo.ht209@gmail.com"}' \
   ${DOMAIN}/user/forgotpassword

curl-update-avatar:
	curl -H 'Content-Type: application/json' -H "Authorization: Bearer ${TOKEN}" \
	--request POST \
   ${DOMAIN}/user/updateavatar


curl-tutor-update-skill:
	curl -H 'Content-Type: application/json' -H "Authorization: Bearer ${TOKEN}" \
	--request PUT \
	--data '{"skills":["IEnglishT"]}' \
   ${DOMAIN}/tutor/updateskills

curl-tutor-update-intro:
	curl -H 'Content-Type: application/json' -H "Authorization: Bearer ${TOKEN}" \
	--request PUT \
	--data '{"introDesc":"Toi day Toan, Ly va Hoa"}' \
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
	--data '{"district":"Quận 8", "minPrice": null}' \
   ${DOMAIN}/tutor/filtertutor/page/1/limit/12

curl-admin-getuser:
	curl -H "Authorization: Bearer ${TOKEN-ADMIN}" \
	${DOMAIN}/admin/getusers/offset/1/limit/12

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
	--data '{"skill":"Biology"}' \
	${DOMAIN}/admin/addskill

curl-admin-updateskill:
	curl -H 'Content-Type: application/json' -H "Authorization: Bearer ${TOKEN-ADMIN}" \
	--request PUT \
	--data '{"skillID": 22, "skill": "Francis"}' \
	${DOMAIN}/admin/updateskill

curl-admin-removeskill:
	curl -H "Authorization: Bearer ${TOKEN-ADMIN}" \
	--request DELETE \
	${DOMAIN}/admin/removeskill/22

curl-admin-lock:
	curl -H 'Content-Type: application/json' -H "Authorization: Bearer ${TOKEN-ADMIN}" \
	--request PUT \
	${DOMAIN}/admin/blockuser/35

curl-admin-unlock:
	curl -H 'Content-Type: application/json' -H "Authorization: Bearer ${TOKEN-ADMIN}" \
	--request PUT \
	${DOMAIN}/admin/unblockuser/35

curl-tutee-renttutor:
	curl -H 'Content-Type: application/json' -H "Authorization: Bearer ${TOKEN-TUTEE}" \
	--request POST \
	--data '{"startTime": "March 21, 2019", "tutorID": "35", "tutorUsername":"Hoang An", "rentTime":"24","rentPrice":"4000000","description":"Toi muon thue gia su"}' \
	${DOMAIN}/tutee/renttutor

curl-tutee-contracthistory:
	curl -H 'Content-Type: application/json' -H "Authorization: Bearer ${TOKEN-TUTEE}" \
	--request GET \
	${DOMAIN}/tutee/contracthistory/offset/0/limit/3

curl-tutee-contract:
	curl -H 'Content-Type: application/json' -H "Authorization: Bearer ${TOKEN-TUTEE}" \
	--request GET \
	${DOMAIN}/tutee/contract/1

curl-tutee-evaluaterate:
	curl -H 'Content-Type: application/json' -H "Authorization: Bearer ${TOKEN-TUTEE}" \
	--request POST \
	--data '{"stars": 4}' \
	${DOMAIN}/tutee/evaluaterate/5

curl-tutee-evaluatecomment:
	curl -H 'Content-Type: application/json' -H "Authorization: Bearer ${TOKEN-TUTEE}" \
	--request POST \
	--data '{"comment":"Thay day rat hay"}' \
	${DOMAIN}/tutee/evaluatecomment/5

curl-tutor-approvecontract:
	curl -H 'Content-Type: application/json' -H "Authorization: Bearer ${TOKEN}" \
	--request POST \
	${DOMAIN}/tutor/approvecontract/6

curl-tutor-contract:
	curl -H 'Content-Type: application/json' -H "Authorization: Bearer ${TOKEN}" \
	--request GET \
	${DOMAIN}/tutor/contract/5

curl-tutor-contracthistory:
	curl -H 'Content-Type: application/json' -H "Authorization: Bearer ${TOKEN}" \
	--request GET \
	${DOMAIN}/tutor/contracthistory/offset/0/limit/2

curl-validate-username:
	curl -H 'Content-Type: application/json' \
	--request POST \
	${DOMAIN}/user/validateusername/anvh20

curl-validate-password:
	curl -H 'Content-Type: application/json' -H "Authorization: Bearer ${TOKEN}" \
	--request POST \
	--data '{"password":"1234"}' \
	${DOMAIN}/user/validatepassword

curl-noti-add:
	curl -H 'Content-Type: application/json' -H "Authorization: Bearer ${TOKEN}" \
	--request POST \
	--data '{"description":"Em muon dang ky hoc"}' \
	${DOMAIN}/noti/add

curl-noti-list:
	curl -H 'Content-Type: application/json' -H "Authorization: Bearer ${TOKEN}" \
	--request GET \
	${DOMAIN}/noti/list/page/1/limit/12

curl-noti:
	curl -H 'Content-Type: application/json' -H "Authorization: Bearer ${TOKEN}" \
	--request GET \
	${DOMAIN}/noti/1

curl-noti-seen:
	curl -H 'Content-Type: application/json' -H "Authorization: Bearer ${TOKEN}" \
	--request POST \
	${DOMAIN}/noti/seen/1

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
