import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Button, Checkbox, Form, Modal,Icon } from 'semantic-ui-react';
import DropdownSearchQuery from '../DropdownSearchQuery';
import 'semantic-ui-css/semantic.min.css';
import MyDatepicker from '../Datepicker';

const modalStyle = { position: 'relative', height: '480px' }

class UpdateSalesForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            id:'',
            dateSold: '',
            dateSold_error: '',
            isOpen: false,
            id: this.props.sale.id,
            dateSold: this.props.sale.dateSold,
            customerId: this.props.sale.customer.id,
            productId: this.props.sale.product.id,
            storeId:this.props.sale.store.id
        };

        this.fillData = this.fillData.bind(this);
        this.close = this.close.bind(this);
        this.open = this.open.bind(this);
    }

    fillData() {
        let url = '/sales/edit/' + this.props.salesId;
        fetch(url)
            .then(response => response.json())
            .then(data => {
                if (data != null) {
                    //debugger
                    this.setState({ 'id': data.id, 'dateSold': data.dateSold, 'customerId': data.customerId, 'productId': data.productId, 'storeId': data.storeId, 'loading': false });
                }
            });
    }
    myValidate = (name) => {
        let isValid = true;
        this.setState({ name_error: "", address_error: "" });
        if (!(name.length > 1 && name.length <= 10)) {
            this.setState({ name_error: "The length of date sold must more than 1 and less than 10" });
            alert('The length of date sold must more than 1 and less than 10');
            isValid = false;
        }

        return isValid;
    }
    
    mySubmitHandler = (event) => {
        event.preventDefault();
        let dateSold = this.state.dateSold;
        let id = this.state.id;
        let customerId = this.state.customerId;
        let productId = this.state.productId;
        let storeId = this.state.storeId;
        let sales = { "id": id, "dateSold": dateSold, 'customerId': customerId, "productId": productId, "storeId": storeId };
        console.log(`Sales:${sales}`);
        debugger;
        this.props.updateData(sales);
        /*fetch('/sales/update', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ "id": id, "dateSold": dateSold, 'customerId': customerId, "productId": productId, "storeId": storeId })
        })
            .then(function (response) {
                return response.json();
            })
            .then(function (myJson) {
                alert(myJson.message);
            });*/
    }
    /*myChangeHandler = (event) => {
        let nam = event.target.name;
        let val = event.target.value;
        this.setState({ [nam]: val });
    }*/

    handleChangeHandler = (newState) => {
        this.setState(newState);
    }

    myDropDownChangeHandler = (returnPropsName, value) => {
        this.setState({ [returnPropsName]: value, });
    }

    close() {
        this.props.requeryData();
        this.setState({ isOpen: false });
    }

    open() {
        this.setState({ isOpen: true });
    }

    render() {
        //console.log(this.props.sale.customerId);
        return (

            <Modal size='mini' style={modalStyle} open={this.state.isOpen} trigger={< Button color='green' onClick={this.open}>Update</Button>}>
                <Modal.Header>Update Sales</Modal.Header>
                <Modal.Content>

                    <Form onSubmit={this.mySubmitHandler}>

                        <Form.Field>
                            <label>Date Sold</label>
                            {/*<Form.Input type='text' name='dateSold' value={this.state.dateSold} onChange={this.myChangeHandler} placeholder='Please input sold date.' />*/}
                            <MyDatepicker name='dateSold' handleChangeHandler={this.handleChangeHandler} initDate={this.state.dateSold}/>&nbsp;
                        </Form.Field>
                        <Form.Field>
                            <label>Customer</label>
                            <DropdownSearchQuery
                                myChangeHandler={this.handleChangeHandler}
                                initValue={this.state.customerId}
                                initOptions={[this.props.sale.customer]}
                                fetchDataUrl='/api/customers'
                                optionTextPropsName='name'
                                optionValuePropsName='id'
                                queryPropsName='nameQry'
                                returnPropsName='customerId'
                            />
                        </Form.Field>
                        <Form.Field>
                            <label>Product</label>
                            <DropdownSearchQuery
                                myChangeHandler={this.handleChangeHandler}
                                initValue={this.state.productId}
                                initOptions={[this.props.sale.product]}
                                fetchDataUrl='/api/products'
                                optionTextPropsName='name'
                                optionValuePropsName='id'
                                queryPropsName='nameQry'
                                returnPropsName='productId'
                            />
                        </Form.Field>
                        <Form.Field>
                            <label>Store</label>
                            <DropdownSearchQuery
                                myChangeHandler={this.handleChangeHandler}
                                initValue={this.state.storeId}
                                initOptions={[this.props.sale.store]}
                                fetchDataUrl='/api/stores'
                                optionTextPropsName='name'
                                optionValuePropsName='id'
                                queryPropsName='nameQry'
                                returnPropsName='storeId'
                            />
                        </Form.Field>
                        <Button type='submit'>Submit</Button>
                        <Button type='button' onClick={this.close}>Close</Button>
                        <Form.Input type='hidden' name='id' value={this.state.id} />
                    </Form>

                </Modal.Content>
            </Modal>

            
        );
    }
}

export default UpdateSalesForm



