require('dotenv').config();
const { ApolloServer, AuthenticationError } = require('apollo-server-express');
const express = require('express');
const { makeExecutableSchema } = require('@graphql-tools/schema');
const { execute, subscribe } = require('graphql');
const { SubscriptionServer } = require('subscriptions-transport-ws');
const { PubSub } = require('graphql-subscriptions');
const mongoose = require('mongoose');
const typeDefs = require('./schema');
const resolvers = require('./resolvers');
const jwt = require('jsonwebtoken');
const User = require('./models/user');
const { bookLoader } = require('./dataLoaders');
const { createServer } = require('http');

const { MONGODB_URI, JWT_SECRET, PORT } = process.env;

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
})
  .then(() => {
    console.log('connected to MongoDB');
  })
  .catch((error) => {
    console.log('error connection to MongoDB:', error.message);
  });

const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

const app = express();

const pubsub = new PubSub();

const server = new ApolloServer({
  schema,
  context: async ({ req }) => {
    const auth = req ? req.headers.authorization : null;
    if (auth && auth.toLowerCase().startsWith('bearer ')) {
      try {
        const decodedToken = jwt.verify(auth.substring(7), JWT_SECRET);
        const currentUser = await User.findById(decodedToken.id);
        if (!currentUser) {
          throw new AuthenticationError('not authenticated');
        }
        return { currentUser, bookLoader, pubsub };
      } catch (err) {
        console.error('Error verifying JWT', err);
        throw new AuthenticationError('Invalid or expired token');
      }
    }
    return { bookLoader, pubsub };
  },
});

(async () => {
  try {
    await server.start();
    server.applyMiddleware({ app });

    const httpServer = createServer(app);

    SubscriptionServer.create(
      {
        execute,
        subscribe,
        schema,
        onConnect: async (connectionParams) => {
          if (connectionParams.authorization) {
            try {
              const decodedToken = jwt.verify(connectionParams.authorization.substring(7), JWT_SECRET);
              const currentUser = await User.findById(decodedToken.id);
              if (!currentUser) {
                throw new AuthenticationError('not authenticated');
              }
              return { currentUser, bookLoader, pubsub };
            } catch (err) {
              console.error('Error verifying JWT in subscription', err);
              throw new AuthenticationError('Invalid or expired token');
            }
          }
          throw new AuthenticationError('Missing auth token!');
        },
        onDisconnect: () => {
          console.log('Disconnected from websocket');
        },
      },
      {
        server: httpServer,
        path: server.graphqlPath,
      },
    );

    httpServer.listen(PORT, () => {
      console.log(`Server ready at http://localhost:${PORT}${server.graphqlPath}`);
      console.log(`Subscriptions ready at ws://localhost:${PORT}${server.graphqlPath}`);
    });
  } catch (error) {
    console.error('Server failed to start', error);
  }
})();
