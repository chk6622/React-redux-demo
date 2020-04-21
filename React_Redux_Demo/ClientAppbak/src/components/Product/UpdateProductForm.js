import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Button, Checkbox, Form } from 'semantic-ui-react';
import { ButtonState } from './State/Update/ComponentState';
import 'semantic-ui-css/semantic.min.css';



class UpdateProductForm extends React.Component {
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

export default UpdateProductForm



