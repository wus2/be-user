curl-api:
	curl --header "Content-Type: application/json" \
	--request POST \
  	--data '{"username":"anvh","password":"123"}' \
  	http://localhost:55210/users/login