import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';

import TodoHeader from './todo-header';
import TodoFooter from './todo-footer';
import TodoList from './todo-list';
import store from '../store';

//index是所有组件的根容器，它的任务只有两个，
//一个是引用子组件，二是注入store

ReactDOM.render(<Provider store={store}>
  <div>
    <TodoHeader/>
    <TodoList/>
    <TodoFooter/>
  </div>
</Provider>, document.querySelector('#root'));
