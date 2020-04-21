import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Button, Checkbox, Form } from 'semantic-ui-react';
import { ButtonState } from './State/Add/ComponentState';
import 'semantic-ui-css/semantic.min.css';



class AddProductForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            price: '',
            name_error: '',
            price_error: '',
            stateObj: new ButtonState(this)
        };
    }
   
    render() {
        return this.state.stateObj.getRenderData();
    }
}

//ReactDOM.render(<AddProductForm />, document.getElementById('AddProductForm'));
export default AddProductForm;



