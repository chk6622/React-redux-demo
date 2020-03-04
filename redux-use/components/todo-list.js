import React from 'react';
import {connect} from 'react-redux';
import actions from '../store/actions';

class TodoList extends React.Component {
  todoChange = (event) => {
    this.props.toggleComplete(event.target.value);
  }
  delClick = (event) => {
    this.props.delTodo(event.target.dataset.id);
  }
  //按diplay条件过滤数据
  filterDisplay() {
     return this.props.todos.filter(item => {
      switch (this.props.display) {
        case 'completed':
          return item.isComplete;
        case 'uncompleted':
          return !item.isComplete;
        case 'all':
        default:
          return true;
      }
    });
  }
  getTodos() {
    return this.filterDisplay().map((todo, index) => {
      return (<li key={index}>
        <input type="checkbox" value={todo.id} checked={todo.isComplete} onChange={this.todoChange}/> {
          todo.isComplete
            ? <del>{todo.title}</del>
            : <span>{todo.title}</span>
        }
        <button type="button" data-id={todo.id} onClick={this.delClick}>删除</button>
      </li>);
    });
  }
  render() {
    return (<div>
      <ul>
        {this.getTodos()}
      </ul>
    </div>);
  }
}
export default connect((state) => ({
  ...state
}), actions)(TodoList);
