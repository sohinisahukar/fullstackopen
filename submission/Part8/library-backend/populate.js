require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Book = require('./models/book');
const Author = require('./models/author');
const User = require('./models/user');

const { MONGODB_URI } = process.env;

const authors = [
  {
    name: 'Robert Martin',
    born: 1952,
  },
  {
    name: 'Martin Fowler',
    born: 1963,
  },
  {
    name: 'Fyodor Dostoevsky',
    born: 1821,
  },
  {
    name: 'Joshua Kerievsky',
  },
  {
    name: 'Sandi Metz',
  },
];

const books = [
  {
    title: 'Clean Code',
    published: 2008,
    author: 'Robert Martin',
    genres: ['refactoring'],
  },
  {
    title: 'Agile software development',
    published: 2002,
    author: 'Robert Martin',
    genres: ['agile', 'patterns', 'design'],
  },
  {
    title: 'Refactoring, edition 2',
    published: 2018,
    author: 'Martin Fowler',
    genres: ['refactoring'],
  },
  {
    title: 'Refactoring to patterns',
    published: 2008,
    author: 'Joshua Kerievsky',
    genres: ['refactoring', 'patterns'],
  },
  {
    title: 'Practical Object-Oriented Design, An Agile Primer Using Ruby',
    published: 2012,
    author: 'Sandi Metz',
    genres: ['refactoring', 'design'],
  },
  {
    title: 'Crime and punishment',
    published: 1866,
    author: 'Fyodor Dostoevsky',
    genres: ['classic', 'crime'],
  },
  {
    title: 'Demons',
    published: 1872,
    author: 'Fyodor Dostoevsky',
    genres: ['classic', 'revolution'],
  },
];

const users = [
    {
      username: 'user1',
      favoriteGenre: 'refactoring',
      password: 'password1',
    },
    {
      username: 'user2',
      favoriteGenre: 'classic',
      password: 'password2',
    },
  ];

const connectDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true,
    });

    console.log('Connected to MongoDB');

    await Author.deleteMany({});
    await Book.deleteMany({});
    await User.deleteMany({});

    const authorDocs = await Author.insertMany(authors);

    const authorMap = authorDocs.reduce((acc, author) => {
      acc[author.name] = author._id;
      return acc;
    }, {});

    const booksWithAuthorIds = books.map((book) => ({
      ...book,
      author: authorMap[book.author],
    }));

    await Book.insertMany(booksWithAuthorIds);

    const saltRounds = 10;
    const userDocs = await Promise.all(users.map(async (user) => {
      const passwordHash = await bcrypt.hash(user.password, saltRounds);
      return new User({
        username: user.username,
        favoriteGenre: user.favoriteGenre,
        passwordHash,
      }).save();
    }));

    console.log('Database populated with initial data');
    mongoose.connection.close();
  } catch (error) {
    console.error('Error connecting to MongoDB or populating data:', error);
  }
};

connectDB();
