import React from 'react';
import ReactDOM from 'react-dom';
import AppRouter from './AppRouter';
import AppStore from './redux/AppStore';
import {Provider} from 'react-redux';

ReactDOM.render(
  <Provider store={AppStore}>
    <AppRouter/>
  </Provider>
  ,
  document.getElementById('root')
);

