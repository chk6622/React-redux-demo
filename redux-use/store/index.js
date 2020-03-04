import {createStore} from 'redux';
import reducer from './reducers';

let store = createStore(reducer);
window._store = store;  //将store对象挂到window上以便于调试，无其它实际意义

export default store;
