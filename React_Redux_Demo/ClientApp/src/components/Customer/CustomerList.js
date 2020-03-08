import React, { Component } from 'react';
import { Icon, Label, Menu, Table, Button,Input } from "semantic-ui-react";
import AddCustomerForm from './AddCustomerForm';
import UpdateCustomerForm from './UpdateCustomerForm';
import DeleteButton from '../DeleteButton.js';

import { reflashCustomers, addCustomer, updateQueryParams, deleteCustomer } from '../../reducers/Customer.js';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import 'semantic-ui-css/semantic.min.css';
import '../../css/AppSheet.css';



class CustomerList extends Component {
    static propTypes = {
        customers: PropTypes.any,
        reflashCustomers: PropTypes.func,
        addCustomer: PropTypes.func,
        updateQueryParams: PropTypes.func,
    }

    constructor (props) {
        super(props);
    }  

    renderCustomersTable() {
        //debugger
        console.log(this.props);
        let paginationParams=this.props.paginate(this.props.curPageIndex);
        let beginPage = paginationParams.beginPage;
        let endPage = paginationParams.endPage;
        let curPage = paginationParams.curPageIndex;
        let pages = new Array();
        //debugger
        for (let ind = beginPage; ind <= endPage; ind++) {
            pages.push(ind);
        }

        let customers = this.props.customers == null ? [] : this.props.customers;
        
        return (
            <>
              <div className='queryBar'>
                    <div>
                        <Input type='text' name='nameQry' onChange={this.props.myChangeHandler} placeholder='Please input name.' />&nbsp;
                        <Input type='text' name='addressQry' onChange={this.props.myChangeHandler} placeholder='Please input address.' />&nbsp;
                        <Button as='a' onClick={()=>this.props.refreshList(1)}>Query</Button>
                    </div>
                    <AddCustomerForm addData={this.props.addData} requeryData={() => this.props.refreshList(this.props.curPageIndex)} isOpen='true' />
              </div>
                <Table celled selectable>
            <Table.Header>
                        {/*<Table.Row>
                            <Table.HeaderCell colSpan='4'>
                                <AddCustomerForm addData={this.props.addData} requeryData={() => this.props.refreshList(this.props.curPageIndex)} isOpen='true' />
                    </Table.HeaderCell> 
                </Table.Row>*/}
                <Table.Row>
                            <Table.HeaderCell width='3'>Name</Table.HeaderCell>
                            <Table.HeaderCell width='9'>Address</Table.HeaderCell>
                            <Table.HeaderCell colspan='2' textAlign='center' width='4'>Option</Table.HeaderCell>
                </Table.Row>
            </Table.Header>

            <Table.Body>
                {customers.map(customer =>
                    <Table.Row key={customer.id}>
                        <Table.Cell>{customer.name}</Table.Cell>
                        <Table.Cell>{customer.address}</Table.Cell>
                        <Table.Cell width='2' textAlign='center'><UpdateCustomerForm customer={customer} updateData={this.props.updateData} requeryData={() => this.props.refreshList(this.props.curPageIndex)} /></Table.Cell>
                        <Table.Cell width='2' textAlign='center'><DeleteButton deleteData={() => this.props.deleteData(customer.id)} requeryData={()=>this.props.refreshList(this.props.curPageIndex)} /></Table.Cell>
                    </Table.Row>
                )}
            </Table.Body>

            <Table.Footer>
                <Table.Row>
                    <Table.HeaderCell colSpan='4'>                       
                            <Menu floated='right' pagination> 
                                    {pages.map(pageIndex => 
                                        <Menu.Item as='a' className={pageIndex == curPage ?'big':'normal'} pageIndex={pageIndex} onClick={this.props.skipPage}>
                                            {pageIndex}   
                                        </Menu.Item>                                    
                                    )}                              
                            </Menu>
                    </Table.HeaderCell>
                </Table.Row>
            </Table.Footer>
                </Table>
            </>
    );
  }

    render() {
    let contents = this.props.loading? <p><em>Loading...</em></p>: this.renderCustomersTable();

    return contents;
  }
}

export default CustomerList;