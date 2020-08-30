import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, applyMiddleware, compose } from 'redux';
import { Provider } from 'react-redux';
import {reducer, Operation} from './reducer/reducer';
import thunk from 'redux-thunk';
import App from './component/app';
import * as serviceWorker from './serviceWorker';

import './index.scss';


const store = createStore(
  reducer,
  compose(
    applyMiddleware(thunk),
    window.__REDUX_DEVTOOLS_EXTENSION__
        ? window.__REDUX_DEVTOOLS_EXTENSION__()
        : (f) => f,
)
);

store.dispatch(Operation.loadTrainings());

ReactDOM.render(
  <Provider store={store}>
    <App />
    </Provider>,
  document.getElementById('root')
);


serviceWorker.unregister();
