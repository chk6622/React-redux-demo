import React, { Component } from 'react';
import { Container } from 'reactstrap';
import { AppMenu } from './AppMenu';
import '../css/AppSheet.css';



export class Layout extends Component {
  static displayName = Layout.name;

    render() {
      let user = JSON.parse(sessionStorage.getItem('user'));
      return (
          <main>
            <banner>
                  Sales Management System
                  {user.access_token}
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
