const keys = require ('./keys'); //API keys or essentially just connection keys(keys.js) put together
/*Below a is logic to get a connection over to redis server*/
const redis = require('redis'); //importing a redis client

const redisClient = redis.createClient({ //creating a redis client name: redisClient
    /*passing an object that has a host of keys.redisHost and port keys.redis.Port */
    host: keys.redisHost,
    port: keys.redisPort,
    retry_strategy: () =>  1000//meaning that if it ever loses connection to our redis server, it should attempt to automatically reconnect to the server once every 1 second
});

/*Below is creating a duplicate of the redis client 
Why?
*/
const sub = redisClient.duplicate(); //sub stands for subscription

/*put function that is going to be use for calculating these fibonacci values given some particular index */

function fib(index){
    if (index < 2 ) return 1;
    return fib(index-1) + fib(index-2);

}

/**below is using the redis client that we just put together, and we are going to watch redis for anytime we get a new value inserted into it
 * and anytime we see a new value,we are going to runt the function fib
*/
sub.on('message',(channel,message) => { //watch redis and get a message anytime that a new value shows up; run this call back function (channel,message)
    redisClient.hset('values',message,fib(parseInt(message))) /*anytime, that we get a new value that shows up in redis, we are going to calculate 
    a new fibonnaci value and then insert that value into a hasvalues(hset) , the key will be the index that we receive(so the message, will be the index value that as was submitted intor our form)
    then we push the newly calculated the fibonacci value  */
});

sub.subscribe('insert'); /*anytime someone inserts a value into redis, we are going to get that value and attempt to calculate the fibonnaci value for it 
                        and then toss back into the redis instance*/