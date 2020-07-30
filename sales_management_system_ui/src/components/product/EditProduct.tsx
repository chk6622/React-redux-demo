import React, {Component} from 'react';
import { Button, Form, Modal,Icon } from 'semantic-ui-react';
import IProduct from './IProduct';

const modalStyle = { position: 'relative', height: '310px' }


interface IEditProductProps{
    updateData:any,
    isOpen:boolean,
    product:IProduct
}

interface IEditProductState{
    [name:string]:any
}

export default class EditProduct extends Component<IEditProductProps,IEditProductState>{
    constructor(props:IEditProductProps){
        super(props);
        this.state={
            isOpen:props.isOpen,
            name:props.product.name,
            price:props.product.price
        }
        this.myChangeHandler=this.myChangeHandler.bind(this);
        this.close=this.close.bind(this);
        this.open=this.open.bind(this);
        this.mySubmitHandler=this.mySubmitHandler.bind(this);
        this.toButton=this.toButton.bind(this);
        this.toModal=this.toModal.bind(this);
    }


    myValidate = (name:string, price:string) => {
        let isValid = true;
        if (!(name.length > 1 && name.length <= 50)) {
            alert('The length of name must more than 1 and less than 50');
            isValid = false;
        }
        var reg = new RegExp("^[0-9]*$");
        if (!reg.test(price)) {
            alert("Please input a number!");
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
        let id=this.props.product.id;
        let name = this.state.name;
        let price = this.state.price;
        if (this.myValidate(name, price)) {
            this.props.updateData({ id, name, price });
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
                <Modal.Header>Edit Product</Modal.Header>
                <Modal.Content>

                    <Form onSubmit={this.mySubmitHandler}>
                        <Form.Field>
                            <label>Name</label>
                            <Form.Input type='text' name='name' value={this.state.name} onChange={this.myChangeHandler} placeholder='Please input product name.' />
                        </Form.Field>
                        <Form.Field>
                            <label>Price</label>
                            <Form.Input type='text' name='price' value={this.state.price} onChange={this.myChangeHandler} placeholder='Please input product price.' />
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