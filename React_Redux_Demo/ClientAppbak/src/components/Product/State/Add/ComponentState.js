import React, { Component } from 'react';
import { Button, Form, Modal,Icon } from 'semantic-ui-react';
//import 'semantic-ui-css/semantic.min.css';
import BaseState from '../BaseState.js';

const modalStyle = { position: 'relative', height: '310px' }


class ButtonState extends BaseState {
    constructor(com) {
        super();
        this.com = com;
    }

    init() {
        console.log(this.com);
        this.com.setState({isOpen: true, stateObj: new AddDataState(this.com) });  //transfer add data state
    }

    getRenderData() {
        let state = this.com.state;
        console.log(this.com);
        return < Button floated='left' icon labelPosition='left' primary size='small' onClick={state.stateObj.init}>
            <Icon name='archive' />
                    Add Product
                </Button>;
    }
}

class AddDataState extends BaseState {
    constructor(com) {
        super();
        this.com = com;
        this.close = this.close.bind(this);
        this.myChangeHandler = this.myChangeHandler.bind(this);
    }

    myValidate = (name, price) => {
        let isValid = true;
        if (!(name.length > 1 && name.length <= 50)) {
            //this.setState({ name_error: "The length of name must more than 1 and less than 50" });
            alert('The length of name must more than 1 and less than 50');
            isValid = false;
        }
        var reg = new RegExp("^[0-9]*$");
        if (!reg.test(price)) {
            //this.setState({ price_error: "Please input a number!" });
            alert("Please input a number!");
            isValid = false;
        }
        return isValid;
    }

    mySubmitHandler = (event) => {
        //debugger
        event.preventDefault();
        let name = this.com.state.name;
        let price = this.com.state.price;
        if (this.myValidate(name, price)) {
            this.com.props.addData({ "name": name, "price": price });
        }
        
    }

    close() {
        this.com.props.requeryData();
        this.com.setState({ isOpen: false, stateObj: new ButtonState(this.com) });
    }

    myChangeHandler = (event) => {
        let nam = event.target.name;
        let val = event.target.value;
        this.com.setState({ [nam]: val });
    }

    getRenderData() {
        let state = this.com.state;
        let form =
            <Modal size='mini' style={modalStyle} open={state.isOpen} >
                <Modal.Header>Add Product</Modal.Header>
                <Modal.Content>

                    <Form onSubmit={state.stateObj.mySubmitHandler}>
                        <Form.Field>
                            <label>Name</label>
                            <Form.Input type='text' name='name' value={state.name} onChange={this.myChangeHandler} placeholder='Please input your name.' />
                        </Form.Field>
                        <Form.Field>
                            <label>Price</label>
                            <Form.Input type='text' name='price' value={state.price} onChange={this.myChangeHandler} placeholder='Please input your price.' />
                        </Form.Field>
                        <Button type='submit'>Submit</Button>
                        <Button type='button' onClick={this.close}>Close</Button>
                    </Form>

                </Modal.Content>
            </Modal>
        return form;
    }
}

export { ButtonState, AddDataState};