import { getBooks, getCart } from 'api';
import React from 'react';
import { useQueries } from 'react-query';

export const PaymentSuccess: React.FC = () => {
  const [
    { isLoading: booksLoading, error: booksError, data: books },
    { isLoading: cartLoading, error: cartError, data: cart },
  ] = useQueries([
    { queryKey: 'cart', queryFn: getCart },
    { queryKey: 'books', queryFn: getBooks },
  ]);

  if (booksLoading || cartLoading) return <div>Loading...</div>;

  if (booksError || cartError) {
    console.log('booksError: ', booksError);
    console.log('cartError: ', cartError);
    return <div>An unexpected error occurred!</div>;
  }

  return <div>Success!</div>;
};
