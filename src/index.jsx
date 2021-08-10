import React, { StrictMode } from 'react';
import ReactDOM from 'react-dom';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import App from './App';
import rootReducer from './store/rootReducer'; 
import './index.css';

// Load environment variables
require("dotenv").config({ path: __dirname + "/../process.env" });

// Initialise redux store
const store = configureStore({reducer: rootReducer});

ReactDOM.render(
  <StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>,
  document.getElementById('root')
);