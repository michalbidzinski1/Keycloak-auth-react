Firstly install keycloak on docker
```
docker run -p 8080:8080 -e KEYCLOAK_ADMIN=admin -e KEYCLOAK_ADMIN_PASSWORD=admin quay.io/keycloak/keycloak:18.0.2 start-dev
```
Then go on localhost:8080 and log in as admin, create a realm named 'myapprealm', and 3 clients:
```
frontend with localhost:3000 
backend with localhost:6000 
webclient with localhost:5001 
```
create user with password, start every file with node index.js and frontend with npm start
