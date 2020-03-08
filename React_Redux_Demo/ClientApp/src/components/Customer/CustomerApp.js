import React, { Component } from 'react';
import CustomerList from './CustomerList';

import { reflashCustomers, addCustomer, updateQueryParams, deleteCustomer } from '../../reducers/Customer.js';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import 'semantic-ui-css/semantic.min.css';
import '../../css/AppSheet.css';



class CustomerApp extends Component {
    static propTypes = {
        customers: PropTypes.any,
        reflashCustomers: PropTypes.func,
        addCustomer: PropTypes.func,
        updateQueryParams: PropTypes.func,
    }


  constructor (props) {
      super(props);
      this.state = {}
      this.queryData = this.queryData.bind(this);
      this.refreshList = this.refreshList.bind(this);
      
      this.myChangeHandler = this.myChangeHandler.bind(this);
      this.skipPage = this.skipPage.bind(this);
      this.getQueryParamsUrl = this.getQueryParamsUrl.bind(this);
      this.paginate = this.paginate.bind(this);
      this.deleteData = this.deleteData.bind(this);

    }  

    componentWillMount() {
        this.refreshList();
    }

    queryData(queryUrl) {

        fetch(queryUrl)
            .then(response => response.json())
            .then(data => {
                let customers = data.results;
                //console.log(customers);
                this.props.reflashCustomers({ customers: customers, totalData: data.totalData, loading: false });  //put customers into redux
            });
    }

    addData = (customer) => {
        fetch('/customer/add', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(customer)
        })
            .then(function (response) {
                return response.json();
            })
            .then(function (myJson) {
                alert(myJson.message);
            });
    }

    updateData=(customer) => {
        fetch('/customer/update', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(customer)
        })
            .then(function (response) {
                return response.json();
            })
            .then(function (myJson) {
                alert(myJson.message);
            });
    }

    deleteData = (customerId) => {
        let url = '/customer/delete/' + customerId;
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
                        this.props.deleteCustomers(customerId)
                    }
                }
            );
    }


    getQueryParamsUrl(queryUrl) {
        let nameQry = this.state['nameQry'];
        let addressQry = this.state['addressQry'];
        if (nameQry != null && nameQry != '') {
            queryUrl += '&nameQry=' + nameQry;
        }
        if (addressQry != null && addressQry != '') {
            queryUrl += '&addressQry=' + addressQry;
        }
        return queryUrl;
    }

    getPaginatedUrl(url, paginationParams) {     
        url += '?skipData=' + paginationParams.skipData + '&dataPerPage=' + paginationParams.dataPerPage;
        return url;
    }

    paginate(curPageIndex=null) {
        //debugger
        let totalData = (this.props.totalData == null || this.props.totalData == undefined) ? 0 : this.props.totalData;
        let dataPerPage = (this.props.dataPerPage == null || this.props.dataPerPage == undefined) ? 5 : this.props.dataPerPage;

        let thisCurPageIndex; //= (this.props.curPageIndex == null || this.props.curPageIndex == undefined) ? 1 : this.props.curPageIndex;
        if (curPageIndex == null) {
            thisCurPageIndex = (this.props.curPageIndex == null || this.props.curPageIndex == undefined) ? 1 : this.props.curPageIndex;
        }
        else {
            thisCurPageIndex = curPageIndex;
        }

        let skipData = (thisCurPageIndex - 1) * dataPerPage;
        //let maxPageNumber = totalData % dataPerPage > 0 ? integer(totalData / dataPerPage) + 1 : int(totalData / dataPerPage);
        let maxPageNumber = Math.ceil(totalData / dataPerPage) <= 0 ? 1 : Math.ceil(totalData / dataPerPage);
        let beginPage = thisCurPageIndex - 2 <= 0 ? 1 : thisCurPageIndex - 2;
        let endPage = thisCurPageIndex + 2 > maxPageNumber ? maxPageNumber : thisCurPageIndex + 2;
        this.props.updateQueryParams({ curPageIndex: thisCurPageIndex});  //put current page index into the store.
        return { totalData: totalData, dataPerPage: dataPerPage, curPageIndex: curPageIndex, skipData: skipData, maxPageNumber: maxPageNumber, beginPage: beginPage, endPage: endPage };
    }


    refreshList(curPageIndex=null) {
        //debugger
        //console.log('refreshList');

        let url = '/customer/query/';
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
        //console.log("enter skipPage method");
        //console.log(name);
        this.refreshList(pageIndex);
    }

    render() {
        return (
            <>
                {/* <div className='listTitle'>
                    <h1>Customer</h1>
                </div> */}
                <div className='listContent'>
                    <CustomerList {...this.props}
                        paginate={this.paginate}
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
    //console.log('Execute mapStateToProps method.')
    //console.log(state);
    return state.customers;
}

const mapDispatchToProps = (dispatch) => {
    console.log('Execute mapDispatchToProps method.')
    return {
        reflashCustomers: (customers) => {
            console.log("Dispatch reflash customers action.");
            dispatch(reflashCustomers(customers))
        },
        addCustomers: (customer) => {
            console.log("Excute add customer action.");
            dispatch(addCustomer(customer))
        },
        updateQueryParams: (queryParams) => {
            console.log("Excute update query params action.");
            dispatch(updateQueryParams(queryParams));
        },
        deleteCustomers: (customerId) => {
            console.log("Excute delete customer action.");
            dispatch(deleteCustomer(customerId));
        }
    }

}

export default connect(mapStateToProps, mapDispatchToProps)(CustomerApp);