import React, { Component } from 'react';
import { Icon, Label, Menu, Table, Button, Confirm, Input } from "semantic-ui-react";
import { reflashStores, addCustomer, updateQueryParams, deleteStore  } from '../../reducers/Store';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import StoreList from './StoreList';
import 'semantic-ui-css/semantic.min.css';
import { GetUser, GetAccessToken } from '../../helpers/UserHelper';
import { environment } from '../../environments/environment';
import { Es7FetchData } from '../../Es7FetchLab';




class StoreApp extends Component {
   static propTypes = {
        stores: PropTypes.any,
        reflashStores: PropTypes.func,
        addStore: PropTypes.func,
        updateQueryParams: PropTypes.func,
    }

  constructor (props) {
      super(props);
      this.state = {
      };
      this.queryData = this.queryData.bind(this);
      //this.deleteData = this.deleteData.bind(this);
      this.refreshList = this.refreshList.bind(this);
      this.myChangeHandler = this.myChangeHandler.bind(this);
      this.skipPage = this.skipPage.bind(this);
      this.skipPage = this.skipPage.bind(this);
      this.getQueryParamsUrl = this.getQueryParamsUrl.bind(this);

    }  

    componentWillMount() {
        this.refreshList();
    }

    queryData(queryUrl, curPage) {   
        var httpHelper = new Es7FetchData();
        let apiUrl = environment.apiBase;
        let url = queryUrl === null ? `${apiUrl}/api/stores` : queryUrl;
        console.log(`execute query ${url}`);
        httpHelper.get(url, GetAccessToken())
            .then((data) => {
                //debugger
                let body = data['body'];
                let pagination = data['pagination'];
                let location = data['location'];
                let stores = body?.value;
                let curPageLink = body?.links.find(link => link.rel === 'self');
                let nextPageLink = body?.links.find(link => link.rel === 'get_next_page');
                let prePageLink = body?.links.find(link => link.rel === 'get_previous_page');
             
                pagination = JSON.parse(pagination);

                this.props.reflashStores({
                    stores: stores,
                    totalData: pagination == null ? null : pagination['totalCount'],
                    dataPerPage: pagination == null ? null : pagination['pageSize'],
                    curPageIndex: pagination == null ? null : pagination['currentPage'],
                    maxPageNumber: pagination == null ? null : pagination['totalPages'],
                    curPageLink: curPageLink == null ? null : curPageLink,
                    nextPageLink: curPageLink == null ? null : nextPageLink,
                    prePageLink: curPageLink == null ? null : prePageLink,
                    loading: false
                });  
            })
    }

    addData = (store) => {
        var httpHelper = new Es7FetchData();
        let apiUrl = environment.apiBase;
        let url = `${apiUrl}/api/stores`;

        httpHelper.post(url, GetAccessToken(), store)
            .then(data => {
                alert(data['msg']);
            });
    }

    updateData = (store) => {
        let httpHelper = new Es7FetchData();
        let apiUrl = environment.apiBase;
        let url = `${apiUrl}/api/stores/${store.id}`;
        console.log(`execute Update ${url}`);
        httpHelper.put(url, GetAccessToken(), store)
            .then(data => {
                alert(data['msg']);
            });
    }

    deleteData = (storeId) => {
        let httpHelper = new Es7FetchData();
        let apiUrl = environment.apiBase;
        let url = `${apiUrl}/api/stores/${storeId}`;
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
                                let stores = body.value;
                                let curPageLink = body.links.find(link => link.rel === 'self');
                                let nextPageLink = body.links.find(link => link.rel === 'get_next_page');
                                let prePageLink = body.links.find(link => link.rel === 'get_previous_page');
                                pagination = JSON.parse(pagination);
                                this.props.reflashStores({
                                    stores: stores,
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

    getPaginatedUrl(url, pageIndex) {
        let pageNumber = pageIndex == null ? 1 : (pageIndex < 1 ? 1 : pageIndex);
        url = `${url}?PageNumber=${pageNumber}`;
        return url;
    }

    refreshList(pageIndex=null) {
        let apiUrl = environment.apiBase;
        let url = `${apiUrl}/api/stores`;
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
                <h1>Stores</h1>
            </div>*/}
            <div className='listContent'>
                <StoreList {...this.props}
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
    //console.log("enter 'mapStateToProps' method");
    //console.log(state);
    return state.storeReducer;
}

const mapDispatchToProps = (dispatch) => {
    return {
        reflashStores: (stores)=>{
            dispatch(reflashStores(stores));
        },
        deleteStore: (deleteId) => {
            dispatch(deleteStore(deleteId));
        },
        updateQueryParams: (queryParam) => {
            dispatch(updateQueryParams(queryParam))
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(StoreApp)