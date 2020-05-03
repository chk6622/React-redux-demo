import React, { Component } from 'react';
import { reflashSales, deleteSales, updateQueryParams} from '../../reducers/Sales';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import SalesList from './SalesList';
import 'semantic-ui-css/semantic.min.css';
import { GetUser, GetAccessToken } from '../../helpers/UserHelper';
import { environment } from '../../environments/environment';
import { Es7FetchData } from '../../Es7FetchLab';




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
         
      };
      this.queryData = this.queryData.bind(this);

      this.refreshList = this.refreshList.bind(this);

      this.skipPage = this.skipPage.bind(this);
      this.skipPage = this.skipPage.bind(this);
      this.getQueryParamsUrl = this.getQueryParamsUrl.bind(this);
      //this.paginate = this.paginate.bind(this);
      this.handleChangeHandler = this.handleChangeHandler.bind(this);
      
    }  

    componentWillMount() {
        this.refreshList();
    }

    queryData(queryUrl) {   
        var httpHelper = new Es7FetchData();
        let apiUrl = environment.apiBase;
        let url = queryUrl === null ? `${apiUrl}/api/sales` : queryUrl;
        console.log(`execute query ${url}`);
        httpHelper.get(url, GetAccessToken())
            .then((data) => {
                //debugger
                let body = data['body'];
                let pagination = data['pagination'];
                let location = data['location'];
                let sales = body.value;
                let curPageLink = body.links.find(link => link.rel === 'self');
                let nextPageLink = body.links.find(link => link.rel === 'get_next_page');
                let prePageLink = body.links.find(link => link.rel === 'get_previous_page');
                pagination = JSON.parse(pagination);
                //pagination['totalCount']
                this.props.reflashSales({
                    sales: sales,
                    totalData: pagination == null ? null : pagination['totalCount'],
                    dataPerPage: pagination == null ? null : pagination['pageSize'],
                    curPageIndex: pagination == null ? null : pagination['currentPage'],
                    maxPageNumber: pagination == null ? null : pagination['totalPages'],
                    curPageLink: curPageLink == null ? null : curPageLink,
                    nextPageLink: curPageLink == null ? null : nextPageLink,
                    prePageLink: curPageLink == null ? null : prePageLink,
                    loading: false
                });  //put sales into redux
            })
    }

    addData = (sales) => {
        var httpHelper = new Es7FetchData();
        let apiUrl = environment.apiBase;
        let url = `${apiUrl}/api/sales`;

        httpHelper.post(url, GetAccessToken(), sales)
            .then(data => {
                alert(data['msg']);
            });
    }

    updateData = (sales) => {
        let httpHelper = new Es7FetchData();
        let apiUrl = environment.apiBase;
        let url = `${apiUrl}/api/sales/${sales.id}`;
        console.log(`execute Update ${url}`);
        debugger;
        httpHelper.put(url, GetAccessToken(), sales)
            .then(data => {
                alert(data['msg']);
            });
    }

    deleteData = (salesId) => {
        let httpHelper = new Es7FetchData();
        let apiUrl = environment.apiBase;
        let url = `${apiUrl}/api/sales/${salesId}`;
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
                                let sales = body.value;
                                let curPageLink = body.links.find(link => link.rel === 'self');
                                let nextPageLink = body.links.find(link => link.rel === 'get_next_page');
                                let prePageLink = body.links.find(link => link.rel === 'get_previous_page');
                                pagination = JSON.parse(pagination);
                                this.props.reflashSales({
                                    sales: sales,
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
        let beginDateSoldQry = this.state['beginDateSoldQry'];
        let endDateSoldQry = this.state['endDateSoldQry'];
        let customerId = this.state['customerId'];
        let productId = this.state['productId'];
        let storeId = this.state['storeId'];
        if (beginDateSoldQry != null && beginDateSoldQry != '') {
            queryUrl += '&beginDateSoldQry=' + beginDateSoldQry;
        }
        if (endDateSoldQry != null && endDateSoldQry != '') {
            queryUrl += '&endDateSoldQry=' + endDateSoldQry;
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

    getPaginatedUrl(url, pageIndex) {
        let pageNumber = pageIndex == null ? 1 : (pageIndex < 1 ? 1 : pageIndex);
        url = `${url}?PageNumber=${pageNumber}`;
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

    refreshList(pageIndex=null) {
        let apiUrl = environment.apiBase;
        let url = `${apiUrl}/api/sales`;
        //let paginationParams = this.paginate();
        url = this.getPaginatedUrl(url, pageIndex);
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
        this.props.updateQueryParams({ curPageIndex: pageIndex });  //put current page index into the store.
        console.log(this.props.curPageIndex);
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
                        //paginate={this.paginate}
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
