import { useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { GET_USER_FAVORITE_GENRE, GET_BOOKS_BY_GENRE } from '../graphql/queries';

const FavoriteBooks = () => {
  const { loading: userLoading, error: userError, data: userData, refetch: refetchUser } = useQuery(GET_USER_FAVORITE_GENRE);
  const favoriteGenre = userData?.me?.favoriteGenre;

  const { loading: booksLoading, error: booksError, data: booksData, refetch: refetchBooks } = useQuery(GET_BOOKS_BY_GENRE, {
    variables: { genre: favoriteGenre },
    skip: !favoriteGenre,
  });

  useEffect(() => {
    if (userData) {
      console.log("User data:", userData);
      refetchUser();
    }
  }, [userData, refetchUser]);

  useEffect(() => {
    if (favoriteGenre) {
      console.log(`Favorite genre: ${favoriteGenre}`);
      refetchBooks();
    }
  }, [favoriteGenre, refetchBooks]);

  if (userLoading || booksLoading) return <p>Loading...</p>;
  if (userError) return <p>Error: {userError.message}</p>;
  if (booksError) return <p>Error: {booksError.message}</p>;

  return (
    <div>
      <h2>Books in your favorite genre: {favoriteGenre}</h2>
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
          {booksData?.allBooks?.length > 0 ? (
            booksData.allBooks.map((book) => (
              <tr key={book.id}>
                <td>{book.title}</td>
                <td>{book.published}</td>
                <td>{book.author.name}</td>
                <td>{book.id}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4">No books available in this genre</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default FavoriteBooks;
