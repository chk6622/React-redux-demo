import React, { Component } from 'react';
import { reflashSales, deleteSales, updateQueryParams} from '../../reducers/Sales';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import SalesList from './SalesList';

import 'semantic-ui-css/semantic.min.css';




class SalesApp extends Component {
    static propTypes={
        sales: PropTypes.any,
        reflashSales: PropTypes.func,
        addSales: PropTypes.func,
        deleteSales: PropTypes.func,
    }


  constructor (props) {
      super(props);
      this.state = {
          /*saless: [],
          loading: true,
          refresh: true,
          totalData: 0,
          dataPerPage: 5,
          curPageIndex: 1,
          skipData: 0,
          maxPageNumber: 1,
          beginPage: 1,
          endPage: 1,*/
      };
      this.queryData = this.queryData.bind(this);

      this.refreshList = this.refreshList.bind(this);
      //this.myChangeHandler = this.myChangeHandler.bind(this);
      //this.myDropDownChangeHandler = this.myDropDownChangeHandler.bind(this);
      this.skipPage = this.skipPage.bind(this);
      this.skipPage = this.skipPage.bind(this);
      this.getQueryParamsUrl = this.getQueryParamsUrl.bind(this);
      this.paginate = this.paginate.bind(this);
      this.handleChangeHandler = this.handleChangeHandler.bind(this);
      
    }  

    componentWillMount() {
        this.refreshList();
    }

    queryData(queryUrl, curPage) {   
        //alert(queryUrl);
        fetch(queryUrl)
            .then(response => response.json())
            .then(data => {
                //console.log('There are '+data.length+' saless.');
                //this.setState({ curPageIndex: curPage, totalData: data.totalData, saless: data.results, loading: false, refresh: !this.state.refresh });
                this.props.reflashSales({ totalData: data.totalData, sales: data.results, loading: false});
            });
    }

    addData = (sales) => {
        fetch('/sales/add', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(sales)
        })
            .then(function (response) {
                return response.json();
            })
            .then(function (myJson) {
                alert(myJson.message);
            });
    }

    updateData = (sales) => {
        fetch('/sales/update', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(sales)
        })
            .then(function (response) {
                return response.json();
            })
            .then(function (myJson) {
                alert(myJson.message);
            });
    }

    deleteData = (salesId) => {
        let url = '/sales/delete/' + salesId;
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
                        this.props.deleteSales(salesId)
                    }
                }
            );
    }
    
    getQueryParamsUrl(queryUrl) {
        let dateSoldQry = this.state['dateSoldQry'];
        let customerId = this.state['customerId'];
        let productId = this.state['productId'];
        let storeId = this.state['storeId'];
        if (dateSoldQry != null && dateSoldQry != '') {
            queryUrl += '&dateSoldQry=' + dateSoldQry;
        }
        if (customerId != null && customerId != '') {
           
            queryUrl += '&customerId=' + customerId;
        }
        if (productId != null && productId != '') {
          
            queryUrl += '&productId=' + productId;
        }
        if (storeId != null && storeId != '') {
            
            queryUrl += '&storeId=' + storeId;
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
        this.props.updateQueryParams({ curPageIndex: thisCurPageIndex });  //put current page index into the store.
        return { totalData: totalData, dataPerPage: dataPerPage, curPageIndex: curPageIndex, skipData: skipData, maxPageNumber: maxPageNumber, beginPage: beginPage, endPage: endPage };
    }

    refreshList(curPageIndex=null) {
        let url = '/sales/query/';
        let paginationParams = this.paginate(curPageIndex);
        url = this.getPaginatedUrl(url, paginationParams);
        url = this.getQueryParamsUrl(url);
        this.queryData(url);
    }

    /*myChangeHandler = (event) => {
        let nam = event.target.name;
        let val = event.target.value;
        this.setState({ [nam]: val });
    }

    myDropDownChangeHandler = (returnPropsName, value) => {
        this.setState({ [returnPropsName]: value, });
    }*/

    handleChangeHandler = (newState) => {
        this.setState(newState);
    }

    skipPage = (event, { pageIndex }) => {
        //debugger
        this.refreshList(pageIndex);
    }

   

    render() {
        console.log("Enter 'render' method!");
        console.log(this.props);
        return (
            <>
                {/*<div className='listTitle'>
                    <h1>Sales</h1>
                </div>*/}
                <div className='listContent'>
                    <SalesList {...this.props}
                        paginate={this.paginate}
                        refreshList={this.refreshList}
                        //myChangeHandler={this.myChangeHandler}
                        //myDropDownChangeHandler={this.myDropDownChangeHandler}
                        handleChangeHandler={this.handleChangeHandler}
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
    console.log(state);
    return state.salesReducer;
}

const mapDispatchToProps=(dispatch)=>{
    return {
        reflashSales: (sales) => {
            dispatch(reflashSales(sales));
        },
        deleteSales: (deleteId) => {
            dispatch(deleteSales(deleteId));
        },
        updateQueryParams: (queryParam) => {
            dispatch(updateQueryParams(queryParam))
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(SalesApp);
