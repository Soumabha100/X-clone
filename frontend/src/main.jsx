import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { Provider } from 'react-redux';
import store from './redux/store.js';

/**
 * This is the main entry point for the React application.
 * It renders the root component (<App />) into the DOM.
 */
ReactDOM.createRoot(document.getElementById('root')).render(
  // React.StrictMode is a wrapper that helps identify potential problems in an application.
  // It activates additional checks and warnings for its descendants.
  <React.StrictMode>
    
    {/* The Provider component from react-redux makes the Redux store available
        to any nested components that need to access the Redux state. */}
    <Provider store={store}>
      {/* <App /> is the root component of your application. */}
      <App />
    </Provider>
  </React.StrictMode>,
)
