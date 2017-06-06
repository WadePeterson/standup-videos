import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as firebase from 'firebase';
import { Provider } from 'react-redux';
import { FirebaseProvider, firebaseReducer } from 'duckbase';
import { createStore, applyMiddleware, combineReducers } from 'redux';
import reduxThunk from 'redux-thunk';
import firebaseConfig from '../config/firebase.config';
import App from './App';

const firebaseApp = firebase.initializeApp(firebaseConfig);
const rootReducer = combineReducers({ firebase: firebaseReducer });
const store = createStore(rootReducer, {}, applyMiddleware(reduxThunk));

ReactDOM.render(
  <Provider store={store}>
    <FirebaseProvider firebaseApp={firebaseApp}>
      <App />
    </FirebaseProvider>
  </Provider>
  , document.getElementById('app'));
