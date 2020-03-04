import './css/AppSheet.css';
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { Provider } from 'react-redux';
import registerServiceWorker from './registerServiceWorker';
import configureStore from './configureStore';

const store = configureStore();
//const baseUrl = document.getElementsByTagName('base')[0].getAttribute('href');

var bases = document.getElementsByTagName('base');
var baseUrl = null;

if (bases.length > 0) {
    baseUrl = bases[0].href;
}

const rootElement = document.getElementById('root');

ReactDOM.render(
    <Provider store={store}>
  <BrowserRouter basename={baseUrl}>
    <App />
        </BrowserRouter>
        </Provider>,
  rootElement);

registerServiceWorker();
