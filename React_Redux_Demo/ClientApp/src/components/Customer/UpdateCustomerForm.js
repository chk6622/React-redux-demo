import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Button, Checkbox, Form, Header, Image, Modal, Icon, Container  } from 'semantic-ui-react'
import 'semantic-ui-css/semantic.min.css';
import { ButtonState, EditDataState } from './State/Update/ComponentState';



class UpdateCustomerForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            id:'',
            name: '',
            address: '',
            name_error: '',
            address_error: '',
            isOpen: false,
            stateObj: new ButtonState(this),
        };
    }

   
    render() {
        return this.state.stateObj.getRenderData();
    }
}

export default UpdateCustomerForm



