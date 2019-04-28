const keys = require ('./keys');

//Express App Setup
const express = require('express'); //require in the express library this is done after, specifying a dependency on package.json("dependencies":"express" : "4.16.3",)
const bodyParser = require('body-pasrser');
const cors = require('cors');

const app = express (); /*creating a new express application.The "app" object on  const app = express (), is the object that is going to receive 
                        and respond to any HTTP request that are coming or going back to the React Application*/
app.use(cors());/*tell the app to use cors and also below
                We then wire to cors(stands for:cross origin resource sharing.It essentially allows us to make request
                from one domain that the react domain is going to be running on to a completely different domain or different port in this case, that the express API
                is hosted on.*/
app.use(bodyParser.json()); /*the bodyParser library is going to parse incoming request fromt the react application and turn the body of the POST request into a json value
that our express API can then easily work with*/

/*Postgres client setup
Logic, where express will communicate with the running postgres server */

const { Pool} = require('pg');
const pgClient = new Pool({ //create a postgres client out of this Pool object
    //pass in some of the different keys that we have configured under key.js for postgres
    user: keys.pgUser,
    host: keys.pgHost,
    database: keys.pgDatabase,
    password: keys.pgPassword,
    port: keys.pgPort
});

//add-on error listener
pgClient.on('error',() => console.log('Lost PG connection')); //anytime that an error with the connection occurs, we will console.log a little message

/*anytime, that we connect to a SQL type database we have to initially create atleast one time a table that is going to store the all of values(meaning the indices that  have been submitted to our fib calculator
the function of the postgres here is just to store all the indices values that have been submitted the fib calculator */

pgClient.query('CREATE TABLE IF NOT EXISTS values (number INT)') /*name of table is values and then it will create a single column of information that referred to as: number */
    .catch((err) =>  console.log(err)); //catch statement just incase if something is wrong when creating the table, it will inform us the table.                                                    

//Redis client setup

const redis = require('redis')

const redisClient = redis.createClient({
    host: keys.redisHost,
    port: keys.redisPort,
    retry_strategy: () => 1000 //if we ever lose connection to redis, try to reconnect once in every one second

});

const redisPublisher = redisClient.duplicate(); /*why duplicate in both files? worker and server
according to redis documentation for this javascript library, if we ever have a client(redisPublisher) 
that is listening or publishing information on redis, we have to make a duplicate connection.
Because when a connection is turned into a connection that will listen or subscribe or publish information,
it cannot be use for other purposes.
*/

//Express route handlers
app.get('/',(req,res) => { /*anytime someome makes a request to the root route of our express application
    Send back, Hi 
    app.get('/',(req,res)  - is an example of get request handler */
    res.send('Hi');
})

/*set up another route handler, and this is use to query a running postgres instance and retrieve all the values
that have ever been submitted to postgres*/
app.get('/values./all', async(req,res) => {
    const values = await pgClient.query('SELECT * from values'); //query to postgres instance
    res.send(values.rows); //send information back to whoever is making request to this route.

});

/*Another route handler which is connecting for redis.
 reach into redis, and retrieve all of the different values, all the different indices
 and calculated values that have ever been submitted to our backend
 hgetall - which means look at a hash value inside the redis instance and just all the information from it.
 the has that we are looking here is values*/
app.get('/values/current', async (req,res) => {
    redisClient.hgetall('values',(err,values) => {
        res.send(values);

    });

});

/*another handler, which funtion as a a receiver that is going to receive a new value coming from the react application
So anytime a user, put a new index on Enter your index 
we are going to use app.post here since we are listening to the input of the user*/

app.post('/values', async(req,res) => {
    const index = req.body.index; //get the index that the user just submitted.Look the index that the user just submitted
    if (parseInt(index) > 40) { //make the index is less than 40
        return res.status(422).send('Index too high');
    }

    redisClient.hset('values',index,'Nothing yet!') //take the value and put in the redis data store
    redisPublisher.publish('insert',index)/* this right here is the message that gets sent
    over to the worker process and say "hey, its time to pull a new value out of redis"
    and start calculating the fibonacci for it*/
    pgClient.query('INSERT INTO values(number) VALUES($1)',[index]) //save the new index that was just submitted in redis  for permanent record
    res.send({working: true});

}) ;

app.listen(5000, err => {
    console.log('Listening')
})



