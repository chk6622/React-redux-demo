import React, { Component } from 'react';
import { Button, Form, Modal } from 'semantic-ui-react';
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
        let product=this.com.props.product;
        this.com.setState({ id: product.id, name: product.name, price: product.price, loading: false, isOpen: true, stateObj: new EditDataState(this.com) });

    }

    getRenderData() {
        let state = this.com.state;
        console.log(this.com);
        return <Button color='green' onClick={state.stateObj.init}>Update</Button>;
    }
}

class EditDataState extends BaseState {
    constructor(com) {
        super();
        this.com = com;
        this.myChangeHandler = this.myChangeHandler.bind(this);
        this.close = this.close.bind(this);
        this.submit = this.submit.bind(this);

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

    submit(event) {
        event.preventDefault();
        let id = this.com.state.id;
        let name = this.com.state.name;
        let price = this.com.state.price;
        if (this.myValidate(name, price)) {
            this.com.props.updateData({ "id": id,"name": name, "price": price});
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
                <Modal.Header>Update Customer</Modal.Header>
                <Modal.Content>
                    <Form onSubmit={this.submit}>
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
                        <Form.Input type='hidden' name='id' value={state.id} />
                    </Form>

                </Modal.Content>
            </Modal>
        return form;
    }
}

export { ButtonState, EditDataState};