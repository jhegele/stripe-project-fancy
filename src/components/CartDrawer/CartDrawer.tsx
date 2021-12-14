import React, { useEffect } from 'react';
import { Offcanvas, Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { CartBook } from './CartBook';
import { useNavigate } from 'react-router';
import { layoutUpdateAll } from 'store/slices/layout';
import { useQueries } from 'react-query';
import { getBooks, getCart } from 'api';

export interface CartDrawerProps {
  show: boolean;
  onClose: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ show, onClose }) => {
  const [
    { isLoading: booksLoading, error: booksError, data: books },
    { isLoading: cartLoading, error: cartError, data: cart },
  ] = useQueries([
    { queryKey: 'books', queryFn: getBooks },
    { queryKey: 'cart', queryFn: getCart },
  ]);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleGoToCheckout = () => {
    dispatch(layoutUpdateAll({ cartDrawer: 'closed', cartLink: 'hidden' }));
    navigate('/checkout');
  };

  if (cartLoading || booksLoading) return <div>Loading...</div>;

  if (cartError || booksError) {
    console.log('cartQuery.error: ', cartError);
    console.log('booksQuery.error: ', booksError);
    return <div>An unexpected error occurred!</div>;
  }

  const amountToDollars = (amount: number): string => {
    return (amount / 100).toFixed(2);
  };

  const checkoutTotal = books
    .map(
      (book) =>
        book.amount *
        (Object.keys(cart).indexOf(book.id) === -1 ? 0 : cart[book.id].quantity)
    )
    .reduce((p, c) => p + c, 0);

  return (
    <Offcanvas show={show} onHide={onClose} placement="end">
      <Offcanvas.Header closeButton>
        <Offcanvas.Title>Cart</Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body>
        {Object.keys(cart).length === 0 ? (
          "You haven't added anything to your cart yet!"
        ) : (
          <React.Fragment>
            <div className="d-grid gap-2 mb-3">
              <Button variant="primary" onClick={handleGoToCheckout}>
                Checkout - ${amountToDollars(checkoutTotal)}
              </Button>
            </div>
            {Object.keys(cart).map((id) => (
              <CartBook key={id} id={id} />
            ))}
          </React.Fragment>
        )}
      </Offcanvas.Body>
    </Offcanvas>
  );
};
