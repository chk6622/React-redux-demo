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
        console.log(this.co);
        let store=this.com.props.store;
        this.com.setState({ id: store.id, name: store.name, address: store.address, loading: false, isOpen: true, stateObj: new EditDataState(this.com) });

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
    }

    myValidate = (name, address) => {
        let isValid = true;
        //this.com.setState({ name_error: "", address_error: "" });
        if (!(name.length > 1 && name.length <= 50)) {
            //this.com.setState({ name_error: "The length of name must more than 1 and less than 50" });
            alert('The length of name must more than 1 and less than 50');
            isValid = false;
        }
        if (!(address.length > 1 && address.length <= 100)) {
            //this.com.setState({ address_error: "The length of address must more than 1 and less than 100" });
            alert('The length of address must more than 1 and less than 100');
            isValid = false;
        }
        return isValid;
    }

    submit(event) {
        event.preventDefault();
        let id = this.com.state.id;
        let name = this.com.state.name;
        let address = this.com.state.address;
        if (this.myValidate(name, address)) {
            this.com.props.updateData({ "id": id,"name": name, "address": address });
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
                <Modal.Header>Update Store</Modal.Header>
                <Modal.Content>

                    <Form onSubmit={state.stateObj.submit}>
                        <Form.Field>
                            <label>Name</label>
                            <Form.Input type='text' name='name' value={state.name} onChange={state.stateObj.myChangeHandler} placeholder='Please input store name.' />
                        </Form.Field>
                        <Form.Field>
                            <label>Address</label>
                            <Form.Input type='text' name='address' value={state.address} onChange={state.stateObj.myChangeHandler} placeholder='Please input store address.' />
                        </Form.Field>
                        <Button type='submit'>Submit</Button>
                        <Button type='button' onClick={state.stateObj.close}>Close</Button>
                        <Form.Input type='hidden' name='id' value={state.id} />
                    </Form>

                </Modal.Content>
            </Modal>
        return form;
    }
}

export { ButtonState, EditDataState};