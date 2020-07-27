import { applyMiddleware, combineReducers, compose, createStore } from 'redux';
import { routerReducer, routerMiddleware } from 'react-router-redux';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';
import AppMenuReducer from './AppMenuReducer';
import CustomerReducer from './CustomerReducer';
import ProductReducer from './ProductReducer';
import StoreReducer from './StoreReducer';
import SaleReducer from './SaleReducer';



const rootReducer = combineReducers({
      AppMenuReducer,
      CustomerReducer,
      ProductReducer,
      StoreReducer,
      SaleReducer,
  });

const store=createStore(
  rootReducer,
    composeWithDevTools(
        applyMiddleware(thunk),
        //applyMiddleware(sagaMiddleware),
        // other store enhancers if any
      )
    );

export default store;