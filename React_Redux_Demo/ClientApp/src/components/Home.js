import React, { Component } from 'react';
import { Container } from 'semantic-ui-react';



export class Home extends Component {
  static displayName = Home.name;

  render () {
    return (
        <Container textAlign='center'>
            <br/>
            <h1>Welcome to the demo!</h1>           
        </Container>
    );
  }
}
