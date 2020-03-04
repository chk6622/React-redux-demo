import React from 'react';
import ReactDOM from 'react-dom';
import {connect} from 'react-redux';
import actions from '../store/actions';

class TodoHeader extends React.Component {
  constructor() {
    super();
  }
  //取得未完成的todo数量
  getUnfinishedCount() {
    return this.props.todos.filter((i) => {
      return !i.isComplete;
    }).length;
  }
  addTodoClick = (event) => {
    this.props.addTodo({
      id: parseInt(Math.random() * 10000000),
      title: this.todoTitle.value,
      isComplete: false
    });
  }
  render() {
    return (<div>
      <div>您有{this.getUnfinishedCount()}件事未完成</div>
      <div>
        <label htmlFor="todo">待办项：</label>
        <input type="text" name="todo" ref={(input) => this.todoTitle = input}/>
        <button type="button" onClick={this.addTodoClick}>添加</button>
      </div>
    </div>);
  }
}

//此时的state就是todos:[...]数据
export default connect((state) => ({
  ...state
}), actions)(TodoHeader);
