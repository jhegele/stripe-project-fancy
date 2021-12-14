# Stripe Project (Fancy Version)

A comprehensive reimagining of the Stripe bookstore project. Entire frontend rewritten in React to enable advanced UI functionality.

## Technology Used

### Backend (Server)

- Python
- Flask

In production, our backend would connect to a database but, as with the provided code, we utilize a set of hard coded products in place of a DB to make development easier. Flask is used primarily for API-specific routing and all UI-specific routing is handed off to the frontend and managed using React Router.

### Frontend (UI)

- React
- Redux
- React Query
- React Bootstrap
- React Router
- Webpack
- Babel
- Typescript

The primary modification to the front end is the addition of a shopping cart which allows the selection and purchase of multiple books. We manage the shopping cart as part of the server session to avoid losing the cart when the page is hard refreshed. Additionally, managing the cart completely on the server allows us to prevent the user from modifying pricing and quantity data that gets passed to Stripe.
