# Ecommerce Website - Frontend

This project acts as https://ecommerce.harrisonhoward.xyz frontend code.\
The website was created as a portfolio project and nothing that takes place on the site is verified (i.e. email verification).

## Host It Myself

### Database

> This project requires [MongoDB](https://www.mongodb.com/) for it's database. All collections and schemas are auto-generated.

### Environment Variables

Depending on your environment you may need these setup.

> _REACT_APP_BASEURL_=http://example.com:6001/ **(development only)**\
> _REACT_APP_GOOGLE_CLIENT_ID_=... **(both environments)**\
> _REACT_APP_STRIPE_CLIENT_ID_=pk_test\_... **(both environments)**

### Development Environment

Script `npm run start` will start the app in `http://localhost:3000`

### Production Environment

Script `npm run build` will build an optimised version of this project. Follow the guide in [Ecommerce Backend](https://github.com/Forbidden-Duck/ecommerce-backend) to get it running along side the backend

## Scripts

All scripts are `create-react-app` defaults

### start

`npm run start`\
Created a development version of the project.

### build

`npm run build`\
Created an optimised production version of the project.

### test

No tests available

### eject

`npm run eject`\
Eject the default configuration options (i.e. webpack) so that the can be easily modified **(not recommended)**.
