import React, { Component } from 'react';
import AppMenu from './AppMenu';
import '../css/AppSheet.css';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Welcome from './Welcome';



export default class Layout extends Component {
  static displayName = Layout.name;

    render() {
        let user:any=sessionStorage.getItem('user');
        if(user){
          user = JSON.parse(user);
        }
        else{
            window.location.href = '/';
        }
      return (
          <main>
            <div className='banner'>
                  Sales Management System
            </div>
            <div className='workarea'>
                <nav>
                      <AppMenu />
                </nav>
                <article className='container'>
                     
                  <Router>
                    <Route path='/Home/Welcome' component={Welcome}/>
                  </Router>
                      
                </article>
            </div>
            <footer>
                      &copy; XING TONG 2019
            </footer>
            
          </main>
    );
  }
}
