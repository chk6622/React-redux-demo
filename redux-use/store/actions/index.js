import {ADD_TODO, TOGGLE_COMPLETE, DEL_TODO, CHANGE_DISPLAY} from './action-type/action-types';

//定义actionCreators
//返回一个大对象，它里面封装所有的定义actionCreator
//redux会在内部调用bindActionCreators将dispatch绑到里面，方便调用
let actions = {
  //添加一条待办，payload参数就是一条待办的数据
  addTodo: function(payload) {
    return {type: ADD_TODO, payload};
  },
  //更改完成状态，此处payload传id
  toggleComplete: function(payload) {
    return {type: TOGGLE_COMPLETE, payload};
  },
  //删除待办项数据，payload为id
  delTodo: function(payload) {
    return {type: DEL_TODO, payload};
  },
  //更改显示待办项的状态，payload为以下3个值（all,uncompleted,completed）
  changeDisplay: function(payload) {
    return {type: CHANGE_DISPLAY, payload};
  }
};

export default actions;
