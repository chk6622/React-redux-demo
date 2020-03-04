import {ADD_TODO, TOGGLE_COMPLETE, DEL_TODO, CHANGE_DISPLAY} from '../actions/action-type/action-types';
// import {combineReducers} from 'redux';
// import counter from './counter';
// import even from './even';

//合并Reducer，合成一个state树
// export default combineReducers({counter, even});

//定义默认状态
let initState = {
  display: 'all', //显示状态(all,uncompleted,completed)
  todos: [
    {
      id: parseInt(Math.random() * 10000000),
      isComplete: false,
      title: '学习redux'
    }, {
      id: parseInt(Math.random() * 10000000),
      isComplete: true,
      title: '学习react'
    }, {
      id: parseInt(Math.random() * 10000000),
      isComplete: false,
      title: '学习node'
    }
  ]
};

/**
 * 定义reducer，它封装了更新state的逻辑，
 * 基于原state返回一个新state
 * @param  {Object} [state=initState] 原state对象，默认值为初始化的数据
 * @param  {Object} action  Action对象
 * @return {Object} 新state
 */
function reducer(state = initState, action) {
  let newState;
  switch (action.type) {
    case ADD_TODO:
      newState = {
        todos: [
          ...state.todos,
          action.payload
        ]
      };
      break;
    case TOGGLE_COMPLETE:
      newState = {
        todos: state.todos.map(item => {
          if (item.id == action.payload) {
            item.isComplete = !item.isComplete;
          }
          return item;
        })
      };
      break;
    case DEL_TODO:
      newState = {
        todos: state.todos.filter(todo => todo.id != action.payload)
      };
      break;
    case CHANGE_DISPLAY:
      newState = {
        display: action.payload,
        todos: [...state.todos]
      };
      break;
    default:
      newState = state;
      break;
  }
  return newState;
}
export default reducer;
