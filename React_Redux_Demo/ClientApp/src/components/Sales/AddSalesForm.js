import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Button, Checkbox, Form,Modal,Icon } from 'semantic-ui-react';
import DropdownSearchQuery from '../DropdownSearchQuery';
import 'semantic-ui-css/semantic.min.css';
import MyDatepicker from '../Datepicker';

const modalStyle = { position: 'relative', height: '480px' }

class AddSalesForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            dateSold: '',

            dateSold_error: '',
            isOpen:false
            
        };
        this.close = this.close.bind(this);
        this.open = this.open.bind(this);
    }
    myValidate = (dateSold) => {      
        let isValid = true;
        this.setState({ name_error: "", address_error: "" });
        if (!(dateSold.length > 1 && dateSold.length <= 10)) {
            this.setState({ dateSold_error: "The length of date sold must more than 1 and less than 10" });
            alert('The length of date sold must more than 1 and less than 10');
            isValid = false;
        }
        
        return isValid;
    }
    mySubmitHandler = (event) => {
        event.preventDefault();
        let dateSold = this.state.dateSold;
        let customerId = this.state.customerId;
        let productId = this.state.productId;
        let storeId = this.state.storeId;

        fetch('/sales/add', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ "dateSold": dateSold, "customerId": customerId, "productId": productId, "storeId": storeId })
        })
            .then(function (response) {
                return response.json();
            })
            .then(function (myJson) {
                alert(myJson.message);
            });
    }
    myChangeHandler = (event) => {
        let nam = event.target.name;
        let val = event.target.value;
        //this.setState({ [nam]: val });
        this.handleChangeHandler({ [nam]: val });
    }
    /*myDropDownChangeHandler = (returnPropsName, value) => {
        this.setState({ [returnPropsName]: value, });
    }*/

    handleChangeHandler = (newState) => {
        this.setState(newState);
    }

    close() {
        this.props.requeryData(1);
        this.setState({ isOpen: false });
    }

    open() {
        this.setState({ isOpen: true });
    }
    render() {
        return (
            <Modal size='mini' style={modalStyle} onClose={() => this.props.requeryData(1)} open={this.state.isOpen} trigger={< Button floated='left' icon labelPosition='left' primary size='small' onClick={this.open}>
                <Icon name='dollar sign' />
                Add Sales
             </Button>}>
                <Modal.Header>Add Sales</Modal.Header>
                <Modal.Content>

                    <Form onSubmit={this.mySubmitHandler}>
                        <Form.Field>
                            <label>Date Sold</label>
                            {/*<Form.Input type='text' name='dateSold' onChange={this.myChangeHandler} placeholder='Please input sold date.' />*/}
                            <MyDatepicker name='dateSold' handleChangeHandler={this.handleChangeHandler}/>&nbsp;
                        </Form.Field>
                        <Form.Field>
                            <label>Customer</label>
                            <DropdownSearchQuery
                                myChangeHandler={this.handleChangeHandler}
                                fetchDataUrl='/customer/query'
                                optionTextPropsName='name'
                                optionValuePropsName='id'
                                returnPropsName='customerId'
                                placeholder='Please select a customer.'
                            />
                        </Form.Field>
                        <Form.Field>
                            <label>Product</label>
                            <DropdownSearchQuery
                                myChangeHandler={this.handleChangeHandler}
                                fetchDataUrl='/product/query'
                                optionTextPropsName='name'
                                optionValuePropsName='id'
                                returnPropsName='productId'
                                placeholder='Please select a product.'
                            />
                        </Form.Field>
                        <Form.Field>
                            <label>Store</label>
                            <DropdownSearchQuery
                                myChangeHandler={this.handleChangeHandler}
                                fetchDataUrl='/store/query'
                                optionTextPropsName='name'
                                optionValuePropsName='id'
                                returnPropsName='storeId'
                                placeholder='Please select a store.'
                            />
                        </Form.Field>

                        <Button type='submit'>Submit</Button>
                        <Button type='button' onClick={this.close}>Close</Button>
                    </Form>

                </Modal.Content>
            </Modal>
            
        );
    }
}

//ReactDOM.render(<AddSalesForm />, document.getElementById('AddSalesForm'));
export default AddSalesForm



