const express = require('express');
const graphqlHTTP = require('express-graphql');
const graphql = require('graphql');
const schema = require('./schema');

const app = express();

app.use('/graphql',graphqlHTTP({
  schema:schema,
  graphiql:true,
}));

const PORT = 3001;
app.listen(PORT,() => {
  console.log(`connected to server at port ${PORT}`);
});