import React, { useState } from 'react';
import { Col, Row } from 'react-bootstrap';
import {
  AiOutlinePlusCircle,
  AiOutlineMinusCircle,
  AiOutlineDelete,
} from 'react-icons/ai';
import { useQueries, useMutation, useQueryClient } from 'react-query';
import { getBooks, getCart, removeBookFromCart, updateBookInCart } from 'api';

export interface CartBookProps {
  id: string;
}

export const CartBook: React.FC<CartBookProps> = ({ id }) => {
  const [minusHover, setMinusHover] = useState<boolean>(false);
  const [plusHover, setPlusHover] = useState<boolean>(false);
  const [deleteHover, setDeleteHover] = useState<boolean>(false);
  const [booksQuery, cartQuery] = useQueries([
    { queryKey: 'books', queryFn: getBooks },
    { queryKey: 'cart', queryFn: getCart },
  ]);
  const queryClient = useQueryClient();
  const removeBookMutation = useMutation(removeBookFromCart, {
    onSuccess: (newCart) => {
      queryClient.setQueryData('cart', newCart);
    },
  });
  const updateBookMutation = useMutation(updateBookInCart, {
    onSuccess: (newCart) => {
      queryClient.setQueryData('cart', newCart);
    },
  });

  if (booksQuery.isLoading || cartQuery.isLoading) return <div>Loading...</div>;

  if (booksQuery.error || cartQuery.error) {
    console.log('booksQuery.error: ', booksQuery.error);
    console.log('cartQuery.error: ', cartQuery.error);
    return <div>An unexpected error occurred!</div>;
  }

  const handleIncreaseQuantity = () => {
    const newQ = cartQuery.data[id].quantity + 1;
    updateBookMutation.mutate({ id: id, quantity: newQ });
  };

  const handleDecreaseQuantity = () => {
    const newQ = cartQuery.data[id].quantity - 1;
    if (newQ <= 0) {
      handleDeleteItem();
    } else {
      updateBookMutation.mutate({ id: id, quantity: newQ });
    }
  };

  const handleDeleteItem = () => {
    removeBookMutation.mutate(id);
  };

  const amountToDollars = (amount: number): string => {
    return (amount / 100).toFixed(2);
  };

  const bookIdx = booksQuery.data.findIndex((b) => b.id === id);
  if (bookIdx === -1) return <div>Error: Invalid book ID</div>;
  const book = booksQuery.data[bookIdx];

  return (
    <div className="m-2 mb-3 border rounded-1">
      <Row>
        <Col xs={4}>
          <div
            style={{
              height: '71px',
              backgroundImage: `url('/images/${book.image}')`,
              backgroundSize: 'cover',
            }}
          >
            <div
              style={{
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'rgba(0, 0, 0, 0.25)',
                fontSize: '2rem',
                fontWeight: 'bold',
                color: '#fff',
              }}
            >
              {cartQuery.data[id].quantity}
            </div>
          </div>
        </Col>
        <Col>
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '100%',
              width: '100%',
            }}
          >
            <Row style={{ width: '100%' }}>
              <Col style={{ textAlign: 'center' }}>
                <AiOutlineMinusCircle
                  onMouseEnter={() => setMinusHover(true)}
                  onMouseLeave={() => setMinusHover(false)}
                  onClick={handleDecreaseQuantity}
                  style={{
                    width: '1.5rem',
                    height: '1.5rem',
                    transition: 'color 0.5s ease',
                    color: minusHover ? 'var(--bs-blue)' : '#000',
                    cursor: 'pointer',
                  }}
                />
              </Col>
              <Col style={{ textAlign: 'center' }}>
                ${amountToDollars(book.amount * cartQuery.data[id].quantity)}
              </Col>
              <Col style={{ textAlign: 'center' }}>
                <AiOutlinePlusCircle
                  onMouseEnter={() => setPlusHover(true)}
                  onMouseLeave={() => setPlusHover(false)}
                  onClick={handleIncreaseQuantity}
                  style={{
                    width: '1.5rem',
                    height: '1.5rem',
                    transition: 'color 0.5s ease',
                    color: plusHover ? 'var(--bs-blue)' : '#000',
                    cursor: 'pointer',
                  }}
                />
              </Col>
              <Col style={{ textAlign: 'center' }}>
                <AiOutlineDelete
                  onMouseEnter={() => setDeleteHover(true)}
                  onMouseLeave={() => setDeleteHover(false)}
                  onClick={handleDeleteItem}
                  style={{
                    width: '1.5rem',
                    height: '1.5rem',
                    transition: 'color 0.5s ease',
                    color: deleteHover ? 'var(--bs-red)' : '#000',
                    cursor: 'pointer',
                  }}
                />
              </Col>
            </Row>
          </div>
        </Col>
      </Row>
      <Row>
        <Col>
          <div
            className="p-1 fw-bold"
            style={{ fontSize: '0.85rem', backgroundColor: '#f0f0f0' }}
          >
            {book.title}
          </div>
        </Col>
      </Row>
    </div>
  );
};
