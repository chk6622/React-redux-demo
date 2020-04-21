import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { ButtonState} from './State/Update/ComponentState'
import { Button, Checkbox, Form } from 'semantic-ui-react'
import 'semantic-ui-css/semantic.min.css';



class UpdateStoreForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            id:'',
            name: '',
            address: '',
            name_error: '',
            address_error: '',
            stateObj:new ButtonState(this)
        };

    }

   
    render() {
        return this.state.stateObj.getRenderData();
    }
}

export default UpdateStoreForm



