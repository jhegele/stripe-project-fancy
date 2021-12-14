import React from 'react';
import { Card, Button } from 'react-bootstrap';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { addBookToCart, getCart, Book, Cart } from 'api';

export type BookCardProps = Book;

export const BookCard: React.FC<BookCardProps> = ({
  id,
  title,
  author,
  description,
  amount,
  image,
}) => {
  const { isLoading, error, data: cart } = useQuery('cart', getCart);
  const queryClient = useQueryClient();
  const addBookMutation = useMutation(addBookToCart, {
    onSuccess: (newCart) => {
      queryClient.setQueryData('cart', newCart);
    },
  });

  if (isLoading) return <div>Loading...</div>;

  if (error) {
    console.log('cartQuery.error: ', error);
    return <div>An unexpected error occurred!</div>;
  }

  const handleAddItem = (addId: string) => {
    let qty = 1;
    if (Object.keys(cart).indexOf(addId) !== -1) {
      qty = cart[addId].quantity + 1;
    }
    addBookMutation.mutate({ id: addId, quantity: qty });
  };

  const priceInDollars = (amount / 100).toFixed(0);
  return (
    <Card className="shadow h-100">
      <Card.Img variant="top" src={`/images/${image}`} />
      <Card.Body>
        <Card.Title className="mb-2">{title}</Card.Title>
        <Card.Subtitle className="mb-3 text-secondary">{author}</Card.Subtitle>
        <Card.Text>{description}</Card.Text>
      </Card.Body>
      <Card.Footer>
        <div className="d-grid gap-2">
          <Button variant="primary" onClick={() => handleAddItem(id)}>
            Add to Cart - ${priceInDollars}
          </Button>
        </div>
      </Card.Footer>
    </Card>
  );
};
