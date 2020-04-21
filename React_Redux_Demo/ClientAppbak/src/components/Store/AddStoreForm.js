import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Button, Checkbox, Form } from 'semantic-ui-react'
import { ButtonState, AddDataState } from './State/Add/ComponentState'
import 'semantic-ui-css/semantic.min.css';



class AddStoreForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            address: '',
            name_error: '',
            address_error: '',
            stateObj: new ButtonState(this)
        };
    }
  
    render() {
        return this.state.stateObj.getRenderData();
    }
}

//ReactDOM.render(<AddStoreForm />, document.getElementById('AddStoreForm'));
export default AddStoreForm



