import { useEffect } from 'react';
import { useSubscription } from '@apollo/client';
import { BOOK_ADDED, GET_ALL_BOOKS } from '../graphql/queries';

const BookSubscription = () => {
  // eslint-disable-next-line no-unused-vars
  const { data, error } = useSubscription(BOOK_ADDED, {
    onSubscriptionData: ({ client, subscriptionData }) => {
      const newBook = subscriptionData.data.bookAdded;
      alert(`New book added: ${newBook.title} by ${newBook.author.name}`);
      client.cache.updateQuery({ query: GET_ALL_BOOKS }, ({ allBooks }) => {
        return {
          allBooks: allBooks.concat(newBook),
        };
      });
    }
  });

  useEffect(() => {
    if (error) {
      console.error('Subscription error:', error);
    }
  }, [error]);

  return null;
};

export default BookSubscription;
