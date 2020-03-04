import React, { Component, useState, useEffect } from 'react';
import { Icon, Label, Menu, Table, Button,Input } from "semantic-ui-react";
import AddSalesForm from './AddSalesForm';
import UpdateSalesForm from './UpdateSalesForm';
import DeleteButton from '../DeleteButton.js';
import DropdownSearchQuery from '../DropdownSearchQuery';
import 'semantic-ui-css/semantic.min.css';
import MyDatepicker from '../Datepicker';

 class SalesList extends Component {



  constructor (props) {
      super(props);
      this.state = {

      };
      this.renderSalesTable = this.renderSalesTable.bind(this);
     }

    renderSalesTable() {
        let paginationParams = this.props.paginate(this.props.curPageIndex);
        let beginPage = paginationParams.beginPage;
        let endPage = paginationParams.endPage;
        let curPage = paginationParams.curPageIndex;
        let pages = new Array();
        //debugger
        for (let ind = beginPage; ind <= endPage; ind++) {
            pages.push(ind);
        }

        let sales = this.props.sales == null ? [] : this.props.sales;

        

        return (
            <div>
                <div>
                    {/*<Input type='text' name='dateSoldQry' onChange={this.props.myChangeHandler} placeholder='Please input date sold.' />&nbsp;*/}
                    <MyDatepicker name='dateSoldQry' handleChangeHandler={this.props.handleChangeHandler} />&nbsp;
                    <DropdownSearchQuery
                        myChangeHandler={this.props.handleChangeHandler}
                        fetchDataUrl='/customer/query'
                        optionTextPropsName='name'
                        optionValuePropsName='id'
                        returnPropsName='customerId'
                        placeholder='Please select a customer.'
                    />&nbsp;
                    <DropdownSearchQuery
                        myChangeHandler={this.props.handleChangeHandler}
                        fetchDataUrl='/product/query'
                        optionTextPropsName='name'
                        optionValuePropsName='id'
                        returnPropsName='productId'
                        placeholder='Please select a product.'
                    />&nbsp;
                    <DropdownSearchQuery
                        myChangeHandler={this.props.handleChangeHandler}
                        fetchDataUrl='/store/query'
                        optionTextPropsName='name'
                        optionValuePropsName='id'
                        returnPropsName='storeId'
                        placeholder='Please select a store.'
                    />&nbsp;
                    <Button as='a' onClick={() => this.props.refreshList(1)}>Query</Button>
                </div>
        <Table celled>
            <Table.Header>
                <Table.Row>
                    <Table.HeaderCell colSpan='6'>
                                <AddSalesForm requeryData={this.props.refreshList}/>
                    </Table.HeaderCell> 
                </Table.Row>
                <Table.Row>
                    <Table.HeaderCell>DateSold</Table.HeaderCell>
                    <Table.HeaderCell>Customer</Table.HeaderCell>
                    <Table.HeaderCell>Product</Table.HeaderCell>
                    <Table.HeaderCell>Store</Table.HeaderCell>
                    <Table.HeaderCell colSpan='2'>Option</Table.HeaderCell>
                    
                </Table.Row>
            </Table.Header>

            <Table.Body>
                {sales.map(sale =>
                    <Table.Row key={sale.id}>
                        <Table.Cell>{sale.dateSold}</Table.Cell>
                        <Table.Cell>{sale.customer == null ? '' : sale.customer.name}</Table.Cell>
                        <Table.Cell>{sale.product == null ? '' : sale.product.name}</Table.Cell>
                        <Table.Cell>{sale.store == null ? '' : sale.store.name}</Table.Cell>
                        <Table.Cell><UpdateSalesForm sale={sale} requeryData={this.props.refreshList}/></Table.Cell>
                        <Table.Cell><DeleteButton deleteData={() => this.props.deleteData(sale.id)} requeryData={() => this.props.refreshList(this.props.curPageIndex)}/></Table.Cell>
                    </Table.Row>
                )}
            </Table.Body>

                    <Table.Footer>
                        <Table.Row>
                            <Table.HeaderCell colSpan='6'>
                                <Menu floated='right' pagination>
                                    {pages.map(pageIndex =>
                                        <Menu.Item as='a' className={pageIndex == curPage ? 'big' : 'normal'} pageIndex={pageIndex} onClick={this.props.skipPage}>
                                            {pageIndex}
                                        </Menu.Item>
                                    )}
                                </Menu>
                            </Table.HeaderCell>
                        </Table.Row>
                    </Table.Footer>
                </Table>
            </div>
    );
  }

    render() {
        console.log("enter 'render' method");
    let contents = this.props.loading? <p><em>Loading...</em></p>: this.renderSalesTable();

    return (
      <>
          {contents}
      </>
    );
  }
}

export default SalesList;