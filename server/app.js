const express = require('express');
const graphqlHTTP = require('express-graphql');
const schema = require('./schema/schema');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

//allow cross-origin requests
app.use(cors());

//connect to mlab database
mongoose.connect("mongodb://nakul:test123@ds063536.mlab.com:63536/gql-ninja");

//once the connection is open, fire the function.
mongoose.connection.once('open', ()=> {
    console.log('connected to database');
})

//this function is going to fire whenever request to /graphql comes in
//express-graphql allows our express app to understand graphql
app.use('/graphql', graphqlHTTP({
    //need to pass in a schema of our data. how our graph will look.
    
    //es6 for     schema: schema
    //setting schema property to schema object we imported above
    schema,

    //we want to use the graphiql tool when we go to /graphql in a browser
    graphiql: true,
}));

app.listen(4000, () => {
    console.log('now listening for requests on port 4000');
});