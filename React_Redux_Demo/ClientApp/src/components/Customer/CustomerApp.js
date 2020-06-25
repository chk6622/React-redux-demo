import React, { Component } from 'react';
import CustomerList from './CustomerList';

import { reflashCustomers, addCustomer, updateQueryParams, deleteCustomer } from '../../reducers/Customer.js';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import 'semantic-ui-css/semantic.min.css';
import '../../css/AppSheet.css';
import { GetUser, GetAccessToken } from '../../helpers/UserHelper';
import { environment } from '../../environments/environment';
import { Es7FetchData } from '../../Es7FetchLab';



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

    componentDidMount() {
        this.refreshList();
    }

    queryData(queryUrl) {
        //debugger
        var httpHelper = new Es7FetchData();
        let apiUrl = environment.apiBase;
        let url = queryUrl === null ? `${apiUrl}/api/customers` : queryUrl;
        console.log(`execute query ${url}`);
        httpHelper.get(url, GetAccessToken())
            .then((data) => {
                //debugger
               let body = data['body'];
                let pagination = data['pagination'];
                let location = data['location'];
                let customers = body?.value;
                let curPageLink = body?.links.find(link => link.rel === 'self');
                let nextPageLink = body?.links.find(link => link.rel === 'get_next_page');
                let prePageLink = body?.links.find(link => link.rel === 'get_previous_page');
                console.log('=========================');
                console.log(customers);
                console.log(pagination);
                console.log(location);
                console.log(curPageLink);
                console.log(nextPageLink);
                console.log(prePageLink);
                console.log('=========================');
                pagination=JSON.parse(pagination);
                //pagination['totalCount']
                this.props.reflashCustomers({
                    customers: customers,
                    totalData: pagination==null?null:pagination['totalCount'],
                    dataPerPage: pagination == null ? null :pagination['pageSize'],
                    curPageIndex: pagination == null ? null :pagination['currentPage'],
                    maxPageNumber: pagination == null ? null : pagination['totalPages'],
                    curPageLink: curPageLink==null?null:curPageLink,
                    nextPageLink: curPageLink == null ? null :nextPageLink,
                    prePageLink: curPageLink == null ? null :prePageLink,
                    loading: false
                });  //put customers into redux
            })

    }

    addData = (customer) => {
        var httpHelper = new Es7FetchData();
        let apiUrl = environment.apiBase;
        let url = `${apiUrl}/api/customers`;

        httpHelper.post(url, GetAccessToken(), customer)
            .then(data => {
                alert(data['msg']);
            });
    }

    updateData = (customer) => {
        let httpHelper = new Es7FetchData();
        let apiUrl = environment.apiBase;
        let url = `${apiUrl}/api/customers/${customer.id}`;
        console.log(`execute Update ${url}`);
        httpHelper.put(url, GetAccessToken(), customer)
            .then(data => {
                alert(data['msg']);
            });
    }

    deleteData = (customerId) => {
        let httpHelper = new Es7FetchData();
        let apiUrl = environment.apiBase;
        let url = `${apiUrl}/api/customers/${customerId}`;
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
                                let customers = body.value;
                                let curPageLink = body.links.find(link => link.rel === 'self');
                                let nextPageLink = body.links.find(link => link.rel === 'get_next_page');
                                let prePageLink = body.links.find(link => link.rel === 'get_previous_page');
                                pagination = JSON.parse(pagination);
                                this.props.reflashCustomers({
                                    customers: customers,
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

    getPaginatedUrl(url,pageIndex) { 
        //debugger;
        /*let skip = paginationParams.skipData;
        let pageSize = paginationParams.pageSize;
        let tempUrl = '';
        if (skip > 0) {
            tempUrl += 'Skip=' + paginationParams.skipData;
        }
        if (tempUrl !== '') {
            tempUrl += '&'
        }
        if (pageSize > 0) {
            tempUrl += 'PageSize=' + paginationParams.dataPerPage;
        }*/
        let pageNumber = pageIndex == null ? 1 : (pageIndex < 1 ? 1 : pageIndex);
        url = `${url}?PageNumber=${pageNumber}`;
        //url += '?Skip=' + paginationParams.skipData + '&PageSize=' + paginationParams.dataPerPage;
        return url;
    }

    paginate(curPageIndex=null) {
        //debugger
        let totalData = (this.props.totalData === null || this.props.totalData === undefined) ? 0 : this.props.totalData;
        let dataPerPage = (this.props.dataPerPage === null || this.props.dataPerPage === undefined) ? 0 : this.props.dataPerPage;

        let thisCurPageIndex; //= (this.props.curPageIndex == null || this.props.curPageIndex == undefined) ? 1 : this.props.curPageIndex;
        if (curPageIndex === null) {
            thisCurPageIndex = (this.props.curPageIndex === null || this.props.curPageIndex === undefined) ? 1 : this.props.curPageIndex;
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
        return { totalData: totalData, dataPerPage: dataPerPage, curPageIndex: thisCurPageIndex, skipData: skipData, maxPageNumber: maxPageNumber, beginPage: beginPage, endPage: endPage };
    }


    refreshList(pageIndex) {
        //debugger
        //console.log('refreshList');
        let apiUrl = environment.apiBase;
        let url = `${apiUrl}/api/customers`;
        //let paginationParams = this.paginate();
        url = this.getPaginatedUrl(url,pageIndex);
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
        this.props.updateQueryParams({ curPageIndex: pageIndex });  //put current page index into the store.
        console.log(this.props.curPageIndex);
        this.refreshList(pageIndex);
    }

    render() {
        //console.log('render !!!!!!!!!!!!!!!!!!!!!!!!!!!')
        //console.log(this.props);
        return (
            <>
                {/* <div className='listTitle'>
                    <h1>Customer</h1>
                </div> */}
                <div className='listContent'>
                    <CustomerList {...this.props}
                        //paginate={this.paginate}
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