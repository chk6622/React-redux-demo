import React, { Component } from 'react';
import AppMenu from './AppMenu';
import 'semantic-ui-css/semantic.min.css';
import '../css/AppSheet.css';
import { Route } from 'react-router-dom';
import Welcome from './Welcome';
import ListCustomer from './customer/ListCustomer';
import ListProduct from './product/ListProduct';
import ListStore from './store/ListStore';
import ListSale from './Sale/ListSale';



export default class Layout extends Component {
  static displayName = Layout.name;

    render() {
        /*let user:any=sessionStorage.getItem('user');
        if(user){
          user = JSON.parse(user);
        }
        else{
            window.location.href = '/';
        }*/
      return (
        <>
          <main>
            <div className='banner'>
                  Sales Management System
            </div>
            <div className='workarea'>
                <nav>
                      <AppMenu />
                </nav>
                <article className='container'>
                     
                
                  <Route path='/Home/Welcome' component={Welcome}/>
                  <Route path='/Home/Customer' component={ListCustomer}/>
                  <Route path='/Home/Product' component={ListProduct}/>
                  <Route path='/Home/Store' component={ListStore}/>
                  <Route path='/Home/Sales' component={ListSale}/>
                
                      
                </article>
            </div>
            <footer>
                      &copy; XING TONG 2019
            </footer>
            
          </main>
          
        </>
    );
  }
}
