import React, { Component } from 'react';
import { Icon, Label, Menu, Table, Button, Confirm,Input } from "semantic-ui-react";
import AddStoreForm from './AddStoreForm';
import UpdateStoreForm from './UpdateStoreForm';
import DeleteButton from '../DeleteButton.js';
import 'semantic-ui-css/semantic.min.css';
import PropTypes from 'prop-types';




class StoreList extends Component {
    static propTypes = {
        stores: PropTypes.any,
        reflashStores: PropTypes.func,
        addStore: PropTypes.func,
        updateQueryParams: PropTypes.func,
    }
    

    constructor (props) {
        super(props);
        //this.renderStoresTable = this.renderStoresTable.bind(this);
    }  

    renderStoresTable() {
        console.log(this.props);
       // let paginationParams = this.props.paginate(this.props.curPageIndex);
        let beginPage = 1; //paginationParams.beginPage;
        let endPage = this.props.maxPageNumber; //paginationParams.endPage;
        let curPage = this.props.curPageIndex;
        let pages = new Array();
        //debugger
        for (let ind = beginPage; ind <= endPage; ind++) {
            pages.push(ind);
        }

        let stores = this.props.stores == null ? [] : this.props.stores;
        
        return (
            <>
                <div className='queryBar'>
                    <div>
                        <Input type='text' name='nameQry' onChange={this.props.myChangeHandler} placeholder='Please input name.' />&nbsp;
                        <Input type='text' name='addressQry' onChange={this.props.myChangeHandler} placeholder='Please input address.' />&nbsp;
                        <Button as='a' onClick={() => this.props.refreshList(1)}>Query</Button>
                    </div>
                    <AddStoreForm addData={this.props.addData} requeryData={() => this.props.refreshList(this.props.curPageIndex)} isOpen='true' />
                </div>
                <Table celled selectable>
            <Table.Header>
                        {/*<Table.Row>
                            <Table.HeaderCell colSpan='4'>
                                <AddStoreForm addData={this.props.addData} requeryData={() => this.props.refreshList(this.props.curPageIndex)} isOpen='true' />
                    </Table.HeaderCell> 
                </Table.Row>*/}
                <Table.Row>
                    <Table.HeaderCell width='3'>Name</Table.HeaderCell>
                    <Table.HeaderCell width='9'>Address</Table.HeaderCell>
                            <Table.HeaderCell colspan='2' textAlign='center' width='4'>Option</Table.HeaderCell>
                </Table.Row>
            </Table.Header>

            <Table.Body>
                {stores.map(store =>
                    <Table.Row key={store.id}>
                        <Table.Cell>{store.name}</Table.Cell>
                        <Table.Cell>{store.address}</Table.Cell>
                        <Table.Cell textAlign='center'><UpdateStoreForm store={store} updateData={this.props.updateData} requeryData={() => this.props.refreshList(this.props.curPageIndex)}/></Table.Cell>
                        <Table.Cell textAlign='center'><DeleteButton deleteData={() => this.props.deleteData(store.id)} requeryData={() => this.props.refreshList(this.props.curPageIndex)}/></Table.Cell>
                    </Table.Row>
                )}
            </Table.Body>

                    <Table.Footer>
                        <Table.Row>
                            <Table.HeaderCell colSpan='4'>
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
    let contents = this.props.loading? <p><em>Loading...</em></p>: this.renderStoresTable();

    return contents;
  }
}

export default StoreList;
