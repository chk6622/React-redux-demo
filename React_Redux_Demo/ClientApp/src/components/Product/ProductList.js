import React, { Component } from 'react';
import { Icon, Label, Menu, Table, Button,Input } from "semantic-ui-react";
import AddProductForm from './AddProductForm';
import UpdateProductForm from './UpdateProductForm';
import DeleteButton from '../DeleteButton.js';
import 'semantic-ui-css/semantic.min.css';
import PropTypes from 'prop-types';




export class ProductList extends Component {
    static propTypes = {
        products: PropTypes.any,
        reflashProducts: PropTypes.func,
        addProduct: PropTypes.func,
        updateQueryParams: PropTypes.func,
    }

    constructor(props) {
        super(props);
    }

    renderProductsTable() {
        let paginationParams = this.props.paginate(this.props.curPageIndex);
        let beginPage = paginationParams.beginPage;
        let endPage = paginationParams.endPage;
        let curPage = paginationParams.curPageIndex;
        let pages = new Array();
        //debugger
        for (let ind = beginPage; ind <= endPage; ind++) {
            pages.push(ind);
        }

        let products = this.props.products == null ? [] : this.props.products;
        return (
            <div>
                <div>
                    <Input type='text' name='nameQry' onChange={this.props.myChangeHandler} placeholder='Please input name.' />&nbsp;
                    <Input type='text' name='priceQry' onChange={this.props.myChangeHandler} placeholder='Please input price.' />&nbsp;
                    <Button as='a' onClick={() => this.props.refreshList(1)}>Query</Button>
                </div>
            <Table celled>
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell colSpan='4'>
                                <AddProductForm addData={this.props.addData} requeryData={() => this.props.refreshList(this.props.curPageIndex)} isOpen='true' />
                        </Table.HeaderCell>
                    </Table.Row>
                    <Table.Row>
                        <Table.HeaderCell>Name</Table.HeaderCell>
                        <Table.HeaderCell>Price</Table.HeaderCell>
                            <Table.HeaderCell colspan='2' textAlign='center'>Option</Table.HeaderCell>
                    </Table.Row>
                </Table.Header>

                <Table.Body>
                    {products.map(product =>
                        <Table.Row key={product.id}>
                            <Table.Cell>{product.name}</Table.Cell>
                            <Table.Cell>{product.price}</Table.Cell>
                            <Table.Cell><UpdateProductForm product={product} updateData={this.props.updateData} requeryData={() => this.props.refreshList(this.props.curPageIndex)} /></Table.Cell>
                            <Table.Cell><DeleteButton deleteData={() => this.props.deleteData(product.id)} requeryData={() => this.props.refreshList(this.props.curPageIndex)}  /></Table.Cell>
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
            </div>
        );
    }

    render() {
        let contents = this.props.loading ? <p><em>Loading...</em></p> : this.renderProductsTable();

        return contents;
    }
}

export default ProductList;
