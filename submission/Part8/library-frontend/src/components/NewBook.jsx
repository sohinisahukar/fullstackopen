
import { useState } from 'react';
import { useMutation } from '@apollo/client';
import { ADD_BOOK, GET_AUTHORS, GET_ALL_BOOKS, GET_BOOKS_BY_GENRE  } from '../graphql/queries';
import { gql } from '@apollo/client';


const NewBook = () => {
  const [title, setTitle] = useState('');
  const [published, setPublished] = useState('');
  const [author, setAuthor] = useState('');
  const [genres, setGenres] = useState('');
  const [addBook] = useMutation(ADD_BOOK, {
    refetchQueries: [{ query: GET_AUTHORS }, { query: GET_ALL_BOOKS }, { query: GET_BOOKS_BY_GENRE }],
    update: (cache, { data: { addBook } }) => {
      cache.modify({
        fields: {
          allBooks(existingBooks = []) {
            const newBookRef = cache.writeFragment({
              data: addBook,
              fragment: gql`
                fragment NewBook on Book {
                  id
                  title
                  published
                  author {
                    name
                  }
                  genres
                }
              `
            });
            return [...existingBooks, newBookRef];
          }
        }
      });
    },
    onError: (error) => {
      console.error('Error adding book:', error);
    }
  });

  const submit = async (event) => {
    event.preventDefault();

    try {
      await addBook({
        variables: {
          title,
          published: parseInt(published, 10),
          author,
          genres: genres.split(',').map(genre => genre.trim())
        }
      });
      setTitle('');
      setPublished('');
      setAuthor('');
      setGenres('');
    } catch (e) {
      console.error('Error adding book', e);
    }
  };

  return (
    <div>
      <h2>Add a New Book</h2>
      <form onSubmit={submit}>
        <div>
          Title
          <input
            value={title}
            onChange={({ target }) => setTitle(target.value)}
          />
        </div>
        <div>
          Published
          <input
            type="number"
            value={published}
            onChange={({ target }) => setPublished(target.value)}
          />
        </div>
        <div>
          Author
          <input
            value={author}
            onChange={({ target }) => setAuthor(target.value)}
          />
        </div>
        <div>
          Genres (comma separated)
          <input
            value={genres}
            onChange={({ target }) => setGenres(target.value)}
          />
        </div>
        <button type="submit">Add Book</button>
      </form>
    </div>
  );
};

export default NewBook;
