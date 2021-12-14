import React, { useEffect } from 'react';
import { Badge, Container, Nav, Navbar } from 'react-bootstrap';
import { Outlet, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store';
import { CartDrawer } from 'components';
import { layoutUpdateCartDrawer } from 'store/slices/layout';
import { useQuery } from 'react-query';
import { getCart } from 'api';

export const Layout: React.FC = () => {
  const { layout } = useSelector((state: RootState) => state);
  const { isLoading, error, data: cart } = useQuery('cart', getCart);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  if (isLoading) return <div>Loading...</div>;

  if (error) return <div>An error occurred!</div>;

  return (
    <React.Fragment>
      <Navbar>
        <Container>
          <Navbar.Brand
            style={{ cursor: 'pointer' }}
            onClick={() => navigate('/')}
          >
            Stripe Press
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse
            id="basic-navbar-nav"
            className="justify-content-end"
          >
            <Nav className="ml-auto">
              <Nav.Link onClick={() => navigate('/')}>Home</Nav.Link>
              {layout.cartLink === 'hidden' ? null : (
                <React.Fragment>
                  <Nav.Link
                    onClick={() => dispatch(layoutUpdateCartDrawer('open'))}
                  >
                    Cart
                    {Object.keys(cart).length === 0 ? null : (
                      <Badge className="ms-1" pill bg="success">
                        {Object.keys(cart)
                          .map((i) => cart[i].quantity)
                          .reduce((p, c) => p + c, 0)}
                      </Badge>
                    )}
                  </Nav.Link>
                  <CartDrawer
                    show={layout.cartDrawer === 'open' ? true : false}
                    onClose={() => dispatch(layoutUpdateCartDrawer('closed'))}
                  />
                </React.Fragment>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <Container>
        <Outlet />
      </Container>
    </React.Fragment>
  );
};
