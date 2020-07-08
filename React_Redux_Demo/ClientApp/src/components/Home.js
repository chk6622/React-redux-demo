import React, { Component } from 'react';
import { Container } from 'semantic-ui-react';



export class Home extends Component {
  static displayName = Home.name;
    
    render() {
        //let user = JSON.parse(sessionStorage.getItem('user'));
    return (
        
        <>
            <div className='welcome'>
                <h1>Hello, Welcome back to the system!</h1>
                
            </div>
        </>

        
    );
  }
}
