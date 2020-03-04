import React from 'react';
import {connect} from 'react-redux';
import actions from '../store/actions';

class TodoFooter extends React.Component {
  constructor() {
    super();
  }
  changeDisplayClick = (event) => {
    this.props.changeDisplay(event.target.dataset.display);
  }
  render() {
    return (<div onClick={this.changeDisplayClick}>
      <button type="button" data-display="all">全部</button>
      <button type="button" data-display="uncompleted">未完成</button>
      <button type="button" data-display="completed">已完成</button>
    </div>);
  }
}
export default connect(state => ({
  ...state
}), actions)(TodoFooter);
