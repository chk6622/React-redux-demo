import React, {Component} from 'react';
import { Button, Form, Modal,Icon } from 'semantic-ui-react';
import ICustomer from './ICustomer';

const modalStyle = { position: 'relative', height: '310px' }


interface IEditCustomerProps{
    updateData:any,
    isOpen:boolean,
    customer:ICustomer
}

interface IEditCustomerState{
    [name:string]:any
}

export default class EditCustomer extends Component<IEditCustomerProps,IEditCustomerState>{
    constructor(props:IEditCustomerProps){
        super(props);
        this.state={
            isOpen:props.isOpen,
            name:props.customer.name,
            address:props.customer.address
        }
        this.myChangeHandler=this.myChangeHandler.bind(this);
        this.close=this.close.bind(this);
        this.open=this.open.bind(this);
        this.mySubmitHandler=this.mySubmitHandler.bind(this);
        this.toButton=this.toButton.bind(this);
        this.toModal=this.toModal.bind(this);
    }


    myValidate = (name:string, address:string) => {
        let isValid = true;
        if (!(name.length > 1 && name.length <= 50)) {
            alert('The length of name must more than 1 and less than 50');
            isValid = false;
        }
        if (!(address.length > 1 && address.length <= 100)) {
            alert('The length of address must more than 1 and less than 100');
            isValid = false;
        }
        return isValid;
    }

    myChangeHandler = (event:any) => {
        let name:string = event.target.name;
        let val:string = event.target.value;
        this.setState({[name]: val});
    }

    mySubmitHandler = (event:any) => {
        //debugger
        event.preventDefault();
        let id=this.props.customer.id;
        let name = this.state.name;
        let address = this.state.address;
        if (this.myValidate(name, address)) {
            this.props.updateData({ id, name, address });
        }
    }

    close() {
        this.setState({ isOpen: false });
    }

    open() {
        this.setState({ isOpen: true });
    }

    toButton(){
        return (
            < Button color='green' onClick={this.open}>
                Update
            </Button>
        );
    }

    toModal(){
        return (
        <Modal size='mini' styles={modalStyle} open={this.state.isOpen}>
                <Modal.Header>Add Customer</Modal.Header>
                <Modal.Content>

                    <Form onSubmit={this.mySubmitHandler}>
                        <Form.Field>
                            <label>Name</label>
                            <Form.Input type='text' name='name' value={this.state.name} onChange={this.myChangeHandler} placeholder='Please input your name.' />
                        </Form.Field>
                        <Form.Field>
                            <label>Address</label>
                            <Form.Input type='text' name='address' value={this.state.address} onChange={this.myChangeHandler} placeholder='Please input your address.' />
                        </Form.Field>
                        <Button type='submit'>Submit</Button>
                        <Button type='button' onClick={this.close}>Close</Button>
                    </Form>

                </Modal.Content>
            </Modal>
        );
    }

    render(){
        let isOpen:boolean=this.state['isOpen'];
        let returnValue:any='';
        if(!isOpen){
            returnValue=this.toButton();
        }else{
            returnValue=this.toModal();
        }
        return returnValue;
    }
}