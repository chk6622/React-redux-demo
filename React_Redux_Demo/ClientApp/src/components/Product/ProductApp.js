import React, { Component } from 'react';
import { Icon, Label, Menu, Table, Button, Input } from "semantic-ui-react";
import { reflashProducts, updateProductQueryParams, deleteProduct } from '../../reducers/Product.js';
import ProductList from './ProductList';
import 'semantic-ui-css/semantic.min.css';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import '../../css/AppSheet.css';




class ProductApp extends Component {
    static propTypes = {
        products: PropTypes.any,
        reflashProducts: PropTypes.func,
        updateProductQueryParams: PropTypes.func,
    }


    constructor(props) {
        super(props);
        this.state = {}
        /*this.state = {
            products: [],
            loading: true,
            refresh: true,
            totalData: 0,
            dataPerPage: 5,
            curPageIndex: 1,
            skipData: 0,
            maxPageNumber: 1,
            beginPage: 1,
            endPage: 1,
        };*/
        this.queryData = this.queryData.bind(this);
        //this.deleteData = this.deleteData.bind(this);
        this.refreshList = this.refreshList.bind(this);
        this.myChangeHandler = this.myChangeHandler.bind(this);
        this.skipPage = this.skipPage.bind(this);
        this.skipPage = this.skipPage.bind(this);
        this.getQueryParamsUrl = this.getQueryParamsUrl.bind(this);
        this.paginate = this.paginate.bind(this);

    }

    componentWillMount() {
        this.refreshList();
    }

    queryData(queryUrl, curPage) {
       console.log(queryUrl)
        fetch(queryUrl)
            .then(response => response.json())
            .then(data => {
                //console.log('There are ' + data.length + ' products.');
               // this.setState({ curPageIndex: curPage, totalData: data.totalData, products: data.results, loading: false, refresh: !this.state.refresh });

                this.props.reflashProducts({ products: data.results, totalData: data.totalData, loading: false });
            });
    }

    addData = (product) => {
        fetch('/product/add', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(product)
        })
            .then(function (response) {
                return response.json();
            })
            .then(function (myJson) {
                alert(myJson.message);
            });
    }

    updateData = (product) => {
        fetch('/product/update', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(product)
        })
            .then(function (response) {
                return response.json();
            })
            .then(function (myJson) {
                alert(myJson.message);
            });
    }

    deleteData = (productId) => {
        let url = '/product/delete/' + productId;
        fetch(url)
            .then(function (response) {
                return response.json();
            })
            .then(function (myJson) {
                alert(myJson.message);
                return myJson;
            })
            .then(
                myJson => {
                    if (myJson.result) {
                        //debugger;
                        this.props.deleteProducts(productId)
                    }
                }
            );
    }

    getQueryParamsUrl(queryUrl) {
        let nameQry = this.state['nameQry'];
        let priceQry = this.state['priceQry'];
        if (nameQry != null && nameQry != '') {
            queryUrl += '&nameQry=' + nameQry;
        }
        if (priceQry != null && priceQry != '') {
            queryUrl += '&priceQry=' + priceQry;
        }
        return queryUrl;
    }

    getPaginatedUrl(url, paginationParams) {
        url += '?skipData=' + paginationParams.skipData + '&dataPerPage=' + paginationParams.dataPerPage;
        return url;
    }

    paginate(curPageIndex = null) {
        //debugger
        let totalData = (this.props.totalData == null || this.props.totalData == undefined) ? 0 : this.props.totalData;
        let dataPerPage = (this.props.dataPerPage == null || this.props.dataPerPage == undefined) ? 5 : this.props.dataPerPage;

        let thisCurPageIndex; 
        if (curPageIndex == null) {
            thisCurPageIndex = (this.props.curPageIndex == null || this.props.curPageIndex == undefined) ? 1 : this.props.curPageIndex;
        }
        else {
            thisCurPageIndex = curPageIndex;
        }

        let skipData = (thisCurPageIndex - 1) * dataPerPage;
        let maxPageNumber = Math.ceil(totalData / dataPerPage) <= 0 ? 1 : Math.ceil(totalData / dataPerPage);
        let beginPage = thisCurPageIndex - 2 <= 0 ? 1 : thisCurPageIndex - 2;
        let endPage = thisCurPageIndex + 2 > maxPageNumber ? maxPageNumber : thisCurPageIndex + 2;
        this.props.updateProductQueryParams({ curPageIndex: thisCurPageIndex });  //put current page index into the store.
        return { totalData: totalData, dataPerPage: dataPerPage, curPageIndex: curPageIndex, skipData: skipData, maxPageNumber: maxPageNumber, beginPage: beginPage, endPage: endPage };
    }

    refreshList(curPageIndex = null) {
        let url = '/product/query/';
        let paginationParams = this.paginate(curPageIndex);
        url = this.getPaginatedUrl(url, paginationParams);
        url = this.getQueryParamsUrl(url);
        this.queryData(url);
    }

    myChangeHandler = (event) => {
        let nam = event.target.name;
        let val = event.target.value;
        this.setState({ [nam]: val });
    }

    skipPage = (event, { pageIndex }) => {
        //debugger
        this.refreshList(pageIndex);
    }


    render() {


        return (
            <div>
                <h1>Products</h1>
                <ProductList {...this.props} 
                    paginate={this.paginate}
                    refreshList={this.refreshList}
                    myChangeHandler={this.myChangeHandler}
                    addData={this.addData}
                    updateData={this.updateData}
                    deleteData={this.deleteData}
                    skipPage={this.skipPage} />
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return state.products;
}

const mapDispatchToProps = (dispatch) => {
    console.log('Execute mapDispatchToProps method.')
    return {
        reflashProducts: (products) => {
            console.log("Dispatch reflash products action.");
            dispatch(reflashProducts(products))
        },
        updateProductQueryParams: (queryParams) => {
            console.log("Excute update query params action.");
            dispatch(updateProductQueryParams(queryParams));
        },
        deleteProducts: (productId) => {
            console.log("Excute delete product action.");
            dispatch(deleteProduct(productId));
        }
    }

}

export default connect(mapStateToProps, mapDispatchToProps)(ProductApp);