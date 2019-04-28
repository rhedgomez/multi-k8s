module.exports = { /*anytime we connect to redis, we are going to look for a hostname
                    or essentially a URL for redis and a port that we are suppose to connect to it from*/
    redisHost: process.env.REDIS_HOST, //REDIS_HOST and REDIS_PORT are called environment variables.
    redisPort: process.env.REDIS_PORT

};