import { applyMiddleware, combineReducers, compose, createStore } from 'redux';
import thunk from 'redux-thunk';
import { routerReducer, routerMiddleware } from 'react-router-redux';
import * as Customer from './reducers/Customer';
import * as Product from './reducers/Product';
import * as Store from './reducers/Store';
import * as Sales from './reducers/Sales';


export default function configureStore (history, initialState) {
    const reducers = {
        customers: Customer.reducer,
        products: Product.reducer,
        storeReducer: Store.reducer,
        salesReducer: Sales.reducer
  };



  // In development, use the browser's Redux dev tools extension if installed
  const enhancers = [];
  const isDevelopment = process.env.NODE_ENV === 'development';
  if (isDevelopment && typeof window !== 'undefined' && window.devToolsExtension) {
   enhancers.push(window.devToolsExtension());
    }


  const rootReducer = combineReducers({
    ...reducers,
    routing: routerReducer
  });

  const middleware = [
        thunk,
      routerMiddleware(history)
    ];

  return createStore(
    rootReducer,
    initialState,
      compose(applyMiddleware(...middleware), ...enhancers)
  );
}
