import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Button, Checkbox, Form, Header, Image, Modal, Icon, Container } from 'semantic-ui-react'
import 'semantic-ui-css/semantic.min.css';
import { ButtonState, EditDataState } from './State/Add/ComponentState';


class AddCustomerForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            address: '',
            name_error: '',
            address_error: '',
            stateObj: new ButtonState(this),
        };
    }
   
   
    
    myChangeHandler = (event) => {
        let nam = event.target.name;
        let val = event.target.value;
        this.setState({ [nam]: val });
    }
    render() {
        
        return this.state.stateObj.getRenderData();
            
    }
}

export default AddCustomerForm



