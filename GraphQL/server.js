var express = require('express');
var { graphqlHTTP } = require('express-graphql');
var { buildSchema } = require('graphql');

const users = [
  { id: 1, name: 'John Doe', email: 'johndoe@gmail.com' },
  { id: 2, name: 'Jane Doe', email: 'janedoe@gmail.com' },
  { id: 3, name: 'Mike Doe', email: 'mikedoe@gmail.com' },
];

// Construct a schema, using GraphQL schema language
var schema = buildSchema(`
  input UserInput {
    email: String!
    name: String!
  }

  type User {
    id: Int!
    name: String!
    email: String!
  }

  type Mutation {
    createUser(input: UserInput!): User
    updateUser(id: Int!, input: UserInput): User
  }

  type Query {
    getUser(id: String): User
    getUsers: [User]
  }
`);

const getUser = (args) => users.find((u) => u.id === args.id);

const getUsers = () => users;

const createUser = (args) => {
  const user = {
    id: users.length + 1,
    ...args.input,
  };
  users.push(user);
  return user;
};

const updateUser = (args) => {
  const index = users.findIndex((u) => u.id === args.user.id);
  const targetUser = users[index];
  if (targetUser) users[index] = args.user;
  return targetUser;
};

// The root provides a resolver function for each API endpoint
var root = {
  getUser,
  getUsers,
  createUser,
  updateUser,
};

var app = express();

app.use(
  '/graphql',
  graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true,
  }),
);
app.listen(4000);

console.log('Running a GraphQL API server at http://localhost:4000/graphql');
