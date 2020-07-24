import { applyMiddleware, combineReducers, compose, createStore } from 'redux';
import { routerReducer, routerMiddleware } from 'react-router-redux';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';
import AppMenuReducer from './AppMenuReducer';



const rootReducer = combineReducers({
  appMenuReducer: AppMenuReducer,
  
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