// library-frontend/src/components/Books.jsx
import { useState, useEffect } from 'react';
import { useQuery, useSubscription } from '@apollo/client';
import { GET_BOOKS_BY_GENRE, BOOK_ADDED } from '../graphql/queries';
import { gql } from '@apollo/client';

const Books = () => {
  const [genre, setGenre] = useState(null);
  const { loading, error, data, refetch } = useQuery(GET_BOOKS_BY_GENRE, {
    variables: { genre },
  });

  useSubscription(BOOK_ADDED, {
    onData: ({ client, subscriptionData }) => {
      if (subscriptionData && subscriptionData.data) {
        const newBook = subscriptionData.data.bookAdded;
        alert(`New book added: ${newBook.title} by ${newBook.author.name}`);
        client.cache.modify({
          fields: {
            allBooks(existingBooks = []) {
              const newBookRef = client.cache.writeFragment({
                data: newBook,
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
                `,
              });
              return [...existingBooks, newBookRef];
            },
          },
        });
        refetch();
      }
    },
  });

  useEffect(() => {
    if (genre) {
      refetch({ genre });
    }
  }, [genre, refetch]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const books = data?.allBooks || [];

  const genres = [...new Set(data.allBooks.flatMap((book) => book.genres))];

  return (
    <div>
      <h2>Books</h2>
      <div>
        {genres.map((g) => (
          <button key={g} onClick={() => setGenre(g)}>
            {g}
          </button>
        ))}
        <button onClick={() => setGenre(null)}>All genres</button>
      </div>
      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Published</th>
            <th>Author</th>
            <th>ID</th>
          </tr>
        </thead>
        <tbody>
          {books.map((book) => (
            <tr key={book.id}>
              <td>{book.title}</td>
              <td>{book.published}</td>
              <td>{book.author.name}</td>
              <td>{book.id}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Books;
