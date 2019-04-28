/** house all the configuration that allows us to connect to a running instance or Redis and Postgres that we associated with fibonacci application*/

module.exports = { 
redisHost: process.env.REDIS_HOST, //REDIS_HOST is an environment variable
redisPort: process.env.REDIS_PORT,
pgUser: process.env.PGUSER, //this configuring the postgres user that we are going to login as
pgHost: process.env.PGHOST,
pgDatabase: process.env.PGDATABASE,//name of the databse inside of postgres that we are going to connect to.
pgPassword: process.env.PGPASSWORD,
pgPort: process.env.PGPORT

};