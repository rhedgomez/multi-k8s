Express server serve as an API layer that communicates with redis and postgres and communicates informaiton over to a running react application
1.server folder is going to house all the code for the express server, that is going to function as the API
2.For package.json
    2.1 - why use nodemon as part of the package.json?
3. index.js
    - house all the logic that we need to connect to redis and postgres and eventually kinda broker information between Redis and Postgres and the running react application.