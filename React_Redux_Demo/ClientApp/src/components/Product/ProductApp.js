import React, { Component } from 'react';
import { Icon, Label, Menu, Table, Button, Input } from "semantic-ui-react";
import { reflashProducts, updateProductQueryParams, deleteProduct } from '../../reducers/Product.js';
import ProductList from './ProductList';
import 'semantic-ui-css/semantic.min.css';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import '../../css/AppSheet.css';
import { GetUser, GetAccessToken } from '../../helpers/UserHelper';
import { environment } from '../../environments/environment';
import { Es7FetchData } from '../../Es7FetchLab';




class ProductApp extends Component {
    static propTypes = {
        products: PropTypes.any,
        reflashProducts: PropTypes.func,
        updateProductQueryParams: PropTypes.func,
    }


    constructor(props) {
        super(props);
        this.state = {}

        this.queryData = this.queryData.bind(this);
        //this.deleteData = this.deleteData.bind(this);
        this.refreshList = this.refreshList.bind(this);
        this.myChangeHandler = this.myChangeHandler.bind(this);
        this.skipPage = this.skipPage.bind(this);
        this.skipPage = this.skipPage.bind(this);
        this.getQueryParamsUrl = this.getQueryParamsUrl.bind(this);
        //this.paginate = this.paginate.bind(this);

    }

    componentWillMount() {
        this.refreshList();
    }

    queryData(queryUrl) {
        var httpHelper = new Es7FetchData();
        let apiUrl = environment.apiBase;
        let url = queryUrl === null ? `${apiUrl}/api/products` : queryUrl;
        console.log(`execute query ${url}`);
        httpHelper.get(url, GetAccessToken())
            .then((data) => {
                //debugger
                let body = data['body'];
                let pagination = data['pagination'];
                let location = data['location'];
                let products = body?.value;
                let curPageLink = body?.links.find(link => link.rel === 'self');
                let nextPageLink = body?.links.find(link => link.rel === 'get_next_page');
                let prePageLink = body?.links.find(link => link.rel === 'get_previous_page');

                pagination = JSON.parse(pagination);
                //pagination['totalCount']
                this.props.reflashProducts({
                    products: products,
                    totalData: pagination == null ? null : pagination['totalCount'],
                    dataPerPage: pagination == null ? null : pagination['pageSize'],
                    curPageIndex: pagination == null ? null : pagination['currentPage'],
                    maxPageNumber: pagination == null ? null : pagination['totalPages'],
                    curPageLink: curPageLink == null ? null : curPageLink,
                    nextPageLink: curPageLink == null ? null : nextPageLink,
                    prePageLink: curPageLink == null ? null : prePageLink,
                    loading: false
                });  //put customers into redux
            })
        /*
       console.log(queryUrl)
        fetch(queryUrl)
            .then(response => response.json())
            .then(data => {
                //console.log('There are ' + data.length + ' products.');
               // this.setState({ curPageIndex: curPage, totalData: data.totalData, products: data.results, loading: false, refresh: !this.state.refresh });

                this.props.reflashProducts({ products: data.results, totalData: data.totalData, loading: false });
            });*/
    }

    addData = (product) => {
        var httpHelper = new Es7FetchData();
        let apiUrl = environment.apiBase;
        let url = `${apiUrl}/api/products`;

        httpHelper.post(url, GetAccessToken(), product)
            .then(data => {
                alert(data['msg']);
            });

       /* fetch('/product/add', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(product)
        })
            .then(function (response) {
                return response.json();
            })
            .then(function (myJson) {
                alert(myJson.message);
            });*/
    }

    updateData = (product) => {
        let httpHelper = new Es7FetchData();
        let apiUrl = environment.apiBase;
        let url = `${apiUrl}/api/products/${product.id}`;
        console.log(`execute Update ${url}`);
        httpHelper.put(url, GetAccessToken(), product)
            .then(data => {
                alert(data['msg']);
            });

        /*
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
            });*/
    }

    deleteData = (productId) => {
        let httpHelper = new Es7FetchData();
        let apiUrl = environment.apiBase;
        let url = `${apiUrl}/api/products/${productId}`;
        console.log(`execute delete ${url}`);
        httpHelper.delete(url, GetAccessToken())
            .then(message => {
                alert(message);
            }).then(
                () => {
                    let curPageLink = this.props.curPageLink;
                    if (curPageLink !== null) {
                        httpHelper.get(curPageLink['href'], GetAccessToken())
                            .then((data) => {
                                //debugger
                                let body = data['body'];
                                let pagination = data['pagination'];
                                let location = data['location'];
                                let products = body.value;
                                let curPageLink = body.links.find(link => link.rel === 'self');
                                let nextPageLink = body.links.find(link => link.rel === 'get_next_page');
                                let prePageLink = body.links.find(link => link.rel === 'get_previous_page');
                                pagination = JSON.parse(pagination);
                                this.props.reflashProducts({
                                    products: products,
                                    totalData: pagination == null ? null : pagination['totalCount'],
                                    dataPerPage: pagination == null ? null : pagination['pageSize'],
                                    curPageIndex: pagination == null ? null : pagination['currentPage'],
                                    maxPageNumber: pagination == null ? null : pagination['totalPages'],
                                    curPageLink: curPageLink === null ? null : curPageLink,
                                    nextPageLink: curPageLink === null ? null : nextPageLink,
                                    prePageLink: curPageLink === null ? null : prePageLink,
                                    loading: false
                                });  //put customers into redux
                            })
                    }
                }
            );
        /*
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
            );*/
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

    getPaginatedUrl(url, pageIndex) {
        let pageNumber = pageIndex == null ? 1 : (pageIndex < 1 ? 1 : pageIndex);
        url = `${url}?PageNumber=${pageNumber}`;
        return url;
    }

    refreshList(pageIndex = null) {
        let apiUrl = environment.apiBase;
        let url = `${apiUrl}/api/products`;
        url = this.getPaginatedUrl(url, pageIndex);
        url = this.getQueryParamsUrl(url);
        this.queryData(url);
    }

    myChangeHandler = (event) => {
        let nam = event.target.name;
        let val = event.target.value;
        this.setState({ [nam]: val });
    }

    skipPage = (event, { pageIndex }) => {
        this.props.updateProductQueryParams({ curPageIndex: pageIndex });  //put current page index into the store.
        console.log(this.props.curPageIndex);
        this.refreshList(pageIndex);
    }


    render() {


        return (
            <>
                {/*<div className='listTitle'>
                    <h1>Products</h1>
                </div>*/}
                <div className='listContent'>
                    <ProductList {...this.props} 
                       // paginate={this.paginate}
                        refreshList={this.refreshList}
                        myChangeHandler={this.myChangeHandler}
                        addData={this.addData}
                        updateData={this.updateData}
                        deleteData={this.deleteData}
                            skipPage={this.skipPage} />
                </div>
            </>
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