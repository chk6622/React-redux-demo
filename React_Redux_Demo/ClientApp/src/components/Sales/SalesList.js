import React, { Component, useState, useEffect } from 'react';
import { Icon, Label, Menu, Table, Button, Segment, Dimmer, Loader } from "semantic-ui-react";
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
        //let paginationParams = this.props.paginate(this.props.curPageIndex);
        let beginPage = 1; //paginationParams.beginPage;
        let endPage = this.props.maxPageNumber; //paginationParams.endPage;
        let curPage = this.props.curPageIndex;
        let pages = new Array();
        //debugger
        for (let ind = beginPage; ind <= endPage; ind++) {
            pages.push(ind);
        }

        let sales = this.props.sales == null ? [] : this.props.sales;

        

        return (
            <>
                <div className='queryBar'>
                    <div>
                        {/*<Input type='text' name='dateSoldQry' onChange={this.props.myChangeHandler} placeholder='Please input date sold.' />&nbsp;*/}
                        <MyDatepicker name='beginDateSoldQry' handleChangeHandler={this.props.handleChangeHandler} /> - <MyDatepicker name='endDateSoldQry' handleChangeHandler={this.props.handleChangeHandler} />&nbsp;
                        <DropdownSearchQuery
                            myChangeHandler={this.props.handleChangeHandler}
                            fetchDataUrl='/api/customers'
                            optionTextPropsName='name'
                            optionValuePropsName='id'
                            queryPropsName='nameQry'
                            returnPropsName='customerId'
                            placeholder='Please select a customer.'
                        />&nbsp;
                        <DropdownSearchQuery
                            myChangeHandler={this.props.handleChangeHandler}
                            fetchDataUrl='/api/products'
                            optionTextPropsName='name'
                            optionValuePropsName='id'
                            queryPropsName='nameQry'
                            returnPropsName='productId'
                            placeholder='Please select a product.'
                        />&nbsp;
                        <DropdownSearchQuery
                            myChangeHandler={this.props.handleChangeHandler}
                            fetchDataUrl='/api/stores'
                            optionTextPropsName='name'
                            optionValuePropsName='id'
                            queryPropsName='nameQry'
                            returnPropsName='storeId'
                            placeholder='Please select a store.'
                        />&nbsp;
                        <Button as='a' onClick={() => this.props.refreshList(1)}>Query</Button>
                    </div>
                    <AddSalesForm requeryData={this.props.refreshList} addData={this.props.addData} />
                </div>
                <Table celled selectable>
            <Table.Header>
                        {/*<Table.Row>
                    <Table.HeaderCell colSpan='6'>
                                <AddSalesForm requeryData={this.props.refreshList}/>
                    </Table.HeaderCell> 
                </Table.Row>*/}
                <Table.Row>
                    <Table.HeaderCell width='3'>DateSold</Table.HeaderCell>
                    <Table.HeaderCell width='3'>Customer</Table.HeaderCell>
                    <Table.HeaderCell width='3'>Product</Table.HeaderCell>
                    <Table.HeaderCell width='3'>Store</Table.HeaderCell>
                            <Table.HeaderCell colSpan='2' textAlign='center' width='4'>Option</Table.HeaderCell>
                    
                </Table.Row>
            </Table.Header>

            <Table.Body>
                {sales.map(sale =>
                    <Table.Row key={sale.id}>
                        <Table.Cell>{sale.dateSold==null?'':sale.dateSold.substr(0, 10)}</Table.Cell>
                        <Table.Cell>{sale.customer == null ? '' : sale.customer.name}</Table.Cell>
                        <Table.Cell>{sale.product == null ? '' : sale.product.name}</Table.Cell>
                        <Table.Cell>{sale.store == null ? '' : sale.store.name}</Table.Cell>
                        <Table.Cell textAlign='center'><UpdateSalesForm sale={sale} requeryData={this.props.refreshList} updateData={this.props.updateData} /></Table.Cell>
                        <Table.Cell textAlign='center'><DeleteButton deleteData={() => this.props.deleteData(sale.id)} requeryData={() => this.props.refreshList(this.props.curPageIndex)} /></Table.Cell>
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
            </>
    );
  }

    render() {
        console.log("enter 'render' method");
        let sales = this.props.sales==null ? [] : this.props.sales;
        let contents = sales.length==0? 
                <>
                    <Segment basic>
                        <Dimmer active inverted>
                            <Loader active inline='centered' size='medium'>Loading</Loader>
                        </Dimmer>
                    </Segment>
                </>
            : this.renderSalesTable();

    return (
      <>
          {contents}
      </>
    );
  }
}

export default SalesList;