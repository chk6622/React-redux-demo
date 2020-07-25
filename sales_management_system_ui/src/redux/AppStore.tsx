import { applyMiddleware, combineReducers, compose, createStore } from 'redux';
import { routerReducer, routerMiddleware } from 'react-router-redux';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';
import AppMenuReducer from './AppMenuReducer';
import CustomerReducer from './CustomerReducer';
import ProductReducer from './ProductReducer';



const rootReducer = combineReducers({
      AppMenuReducer,
      CustomerReducer,
      ProductReducer,
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