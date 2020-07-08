import React, { Component } from 'react';
import { Container } from 'reactstrap';
import { AppMenu } from './AppMenu';
import '../css/AppSheet.css';
import { environment } from '../environments/environment';



export class Layout extends Component {
  static displayName = Layout.name;

    render() {
        /*let user = JSON.parse(sessionStorage.getItem('user'));
        if (!user) {
            //alert('abc');
            window.location = '/';
        }*/
      return (
          <main>
            <banner>
                  Sales Management System
            </banner>
            <div className='workarea'>
                <nav>
                      <AppMenu />
                </nav>
                <article>
                      <Container className='container'>
                        {this.props.children}
                    </Container>
                </article>
            </div>
            <footer>
                      &copy; XING TONG 2019
            </footer>
          </main>
    );
  }
}
