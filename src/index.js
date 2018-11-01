import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import createSagaMiddleWare from 'redux-saga';
import { createLogger } from 'redux-logger';

import reducer from './helpers/reducer/index';
import sagas from './helpers/saga/index';
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/index.css';
import App from './App.jsx';

const logger = createLogger();
const saga = createSagaMiddleWare();
const store = createStore(reducer, {}, applyMiddleware(logger, saga));
window.store = store;
saga.run(sagas);

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root'),
);
