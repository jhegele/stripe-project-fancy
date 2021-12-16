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

## How to Run This Project

### Getting the Code

You will need to clone this repo using one of the following approaches:

HTTP: `git clone https://github.com/jhegele/stripe-project-fancy.git`

SSH: `git clone git@github.com:jhegele/stripe-project-fancy.git`

Once the project is cloned, navigate into the project directory using:

`cd stripe-project-fancy`

### Python Setup

As always, you should utilize a virtual environment for any new Python project. There are mulitple approaches to managing Python virtual environments, so use the one that you are most comfortable with and, once you have a new environment established, use `pip install -r requirements.txt` to install all dependencies.

### Javascript Setup

_Note: This project was built using Yarn for Javascript package management. While NPM and Yarn are typically fairly easy to switch between, I have not tested building via NPM. That said, it's difficult for me to imagine that any issues would pop up should you choose to use NPM instead._

Run `yarn` (or `npm install` if using NPM) to install all dependencies

### Environment Variables

You will need to create a file named `.env` and add two variables:

1. `STRIPE_SECRET_KEY`
2. `STRIPE_PUBLISHABLE_KEY`

These values for these variables will come from your Stripe test account.

### Running The Project

At this point, you have everything you need to successfully run the project. There are a couple of approaches to running the project:

**Server Only**

This option runs only the Python Flask server and utilizes the prebuilt JS code that is included in the repo. There are two approaches to running the server:

`python app.py` or `yarn serve` (`npm run serve` if using NPM)

There is no difference between any of these, as you can see in the `package.json` file, the `serve` script is simply an alias for the direct Python command.

**Server & Webpack Build**

This option runs the Python server and builds the JS code using Webpack. The JS build is a dev build so Webpack will watch the `./src` directory for changes and rebuild when any change is detected. Rebuilding via Webpack is not necessary at all but these instructions are provided in an effort to be comprehensive.

`yarn dev` (`npm run dev` if using NPM)

These two scripts leverage the JS package `concurrently` to run the Python server and the Webpack build concurrently.

Once you have the server (with or without Webpack) running, open a browser and navigate to `http://localhost:5000` to load the application.

## But Why?

Why rebuild the UI in React? Good question! After putting together a basic version of this same project that simply adds and enables the payment functionality, I realized that, in the real world, online shopping and payments processing look a little different than the foundation that the project provided. While I _could_ have, in theory, built the shopping cart functionality and most of what you see here in vanilla JS, utilizing a modern UI framework like React makes the experience much easier to manage. Moreover, it is likely to be more realistic as most modern dev teams are utilizing tools like React, Vue, or Angular to power their UIs these days.

Why Typescript? That's just because I like it. It makes code completion much more powerful and helpful. Plus it helps insure that I don't misuse that one random property that I added to that one random component back at the beginning of my project and I've since completely forgotten about.

## No `create-react-app`?

Nope. Not because I have anything against using `create-react-app`. I just never learned to use it to bootstrap a project and I kind of enjoy building out my own Webpack configs.
