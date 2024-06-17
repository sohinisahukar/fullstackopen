const { UserInputError, AuthenticationError } = require('apollo-server');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { PubSub } = require('graphql-subscriptions');
const Author = require('./models/author');
const Book = require('./models/book');
const User = require('./models/user');
const { bookLoader } = require('./dataLoaders');

const JWT_SECRET = process.env.JWT_SECRET;
const pubsub = new PubSub();

const resolvers = {
  Query: {
    bookCount: async () => {
      try {
        return await Book.collection.countDocuments();
      } catch (error) {
        console.error('Error fetching book count:', error);
        throw new Error('Error fetching book count');
      }
    },
    authorCount: async () => {
      try {
        return await Author.collection.countDocuments();
      } catch (error) {
        console.error('Error fetching author count:', error);
        throw new Error('Error fetching author count');
      }
    },
    allBooks: async (root, args) => {
      try {
        let filter = {};
        if (args.author) {
          const author = await Author.findOne({ name: args.author });
          if (author) {
            filter.author = author._id;
          }
        }
        if (args.genre) {
          filter.genres = { $in: [args.genre] };
        }
        return await Book.find(filter).populate('author');
      } catch (error) {
        console.error('Error fetching all books:', error);
        throw new Error('Error fetching all books');
      }
    },
    allAuthors: async () => {
      try {
        const authors = await Author.find({});
        return authors.map(author => ({
          ...author._doc,
          bookCount: Book.countDocuments({ author: author._id })
        }));
      } catch (error) {
        console.error('Error fetching all authors:', error);
        throw new Error('Error fetching all authors');
      }
    },
    me: (root, args, context) => {
      return context.currentUser;
    }
  },
  Author: {
    bookCount: async (root) => {
      try {
        const books = await bookLoader.load(root._id);
        return books.length;
      } catch (error) {
        console.error('Error fetching book count for author:', error);
        throw new Error('Error fetching book count for author');
      }
    }
  },
  Mutation: {
    addBook: async (root, args, context) => {
      const currentUser = context.currentUser;

      if (!currentUser) {
        throw new AuthenticationError('not authenticated');
      }

      const author = await Author.findOne({ name: args.author });
        if (!author) {
          throw new UserInputError('Author not found');
        }

        const book = new Book({ ...args, author: author._id });
        try {
        await book.save();
        await book.populate('author').execPopulate();
        pubsub.publish('BOOK_ADDED', { bookAdded: book });
        
      } catch (error) {
        console.error('Error adding book:', error);
        throw new UserInputError(error.message, {
          invalidArgs: args,
        });
      }
      return book;
    },
    editAuthor: async (root, args, context) => {
      const currentUser = context.currentUser;

      if (!currentUser) {
        throw new AuthenticationError('not authenticated');
      }

      try {
        const author = await Author.findOne({ name: args.name });
        if (!author) {
          throw new UserInputError('Author not found', {
            invalidArgs: args.name,
          });
        }

        author.born = args.setBornTo;
        await author.save();

        return author;
      } catch (error) {
        console.error('Error editing author:', error);
        throw new UserInputError(error.message, {
          invalidArgs: args,
        });
      }
    },
    createUser: async (root, args) => {
      const saltRounds = 10;
      const passwordHash = await bcrypt.hash('hardcodedpassword', saltRounds);

      const user = new User({
        username: args.username,
        favoriteGenre: args.favoriteGenre,
        passwordHash,
      });

      try {
        await user.save();
        return user;
      } catch (error) {
        console.error('Error creating user:', error);
        throw new UserInputError(error.message, {
          invalidArgs: args,
        });
      }
    },
    login: async (root, args) => {
      console.log(`Attempting login for username: ${args.username}`);

      try {
        const user = await User.findOne({ username: args.username });
        if (!user) {
          console.log('User not found');
          throw new UserInputError('wrong credentials');
        }

        const passwordCorrect = await bcrypt.compare(args.password, user.passwordHash);
        if (!passwordCorrect) {
          console.log('Password incorrect');
          throw new UserInputError('wrong credentials');
        }

        console.log('Login successful');

        const userForToken = {
          username: user.username,
          id: user._id,
        };

        return { value: jwt.sign(userForToken, JWT_SECRET) };
      } catch (error) {
        console.error('Error during login:', error);
        throw new UserInputError('Error during login');
      }
    }
  },
  Subscription: {
    bookAdded: {
      subscribe: () => pubsub.asyncIterator(['BOOK_ADDED'])
    }
  }
};

module.exports = resolvers;
