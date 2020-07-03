import { createStore, applyMiddleware } from 'redux';
import AppMenuReducer from './AppMenuReducer';

const store=createStore(AppMenuReducer);

export default store;