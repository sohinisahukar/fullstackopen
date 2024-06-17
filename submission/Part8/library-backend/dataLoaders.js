const DataLoader = require('dataloader');
const Book = require('./models/book');

// Batch loading function
const batchBooks = async (authorIds) => {
  const books = await Book.find({ author: { $in: authorIds } });
  return authorIds.map(id => books.filter(book => book.author.toString() === id.toString()));
};

// Create DataLoader instance
const bookLoader = new DataLoader(batchBooks);

module.exports = { bookLoader };
