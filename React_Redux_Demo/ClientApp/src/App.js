import React, { Component } from 'react';
import { Route, IndexRoute } from 'react-router';
import { Layout } from './components/Layout';
import { Home } from './components/Home';
import CustomerApp from './components/Customer/CustomerApp';
import ProductApp  from './components/Product/ProductApp';
import StoreApp  from './components/Store/StoreApp';
import SalesApp from './components/Sales/SalesApp';
import Login from './components/Login';

export default class App extends Component {
  static displayName = App.name;

  render () {
      return (
          <>
              <Route exact path='/' component={Login} />
              <Route path='/Home'>
                  <Layout>
                      <Route path='/Home/index' component={Home} />
                      <Route path='/Home/store' component={StoreApp} />
                      <Route path='/Home/product' component={ProductApp} />
                      <Route path='/Home/customer' component={CustomerApp} />
                      <Route path='/Home/sales' component={SalesApp} />
                  </Layout>
              </Route>
          </>
    );
  }
}
