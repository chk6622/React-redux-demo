import React, { Component } from 'react';
import { Icon, Label, Menu, Table, Button, Confirm, Input } from "semantic-ui-react";
import { reflashStores, addCustomer, updateQueryParams, deleteStore  } from '../../reducers/Store';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import StoreList from './StoreList';

//import AddStoreModal from './AddStoreModal';
//import UpdateStoreModal from './UpdateStoreModal';
//import DeleteButton from '../DeleteButton.js';
import 'semantic-ui-css/semantic.min.css';




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
          /*stores: [],
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
        console.log(queryUrl);
        fetch(queryUrl)
            .then(response => response.json())
            .then(data => {
                console.log('There are ' + data.length + ' stores. They are:');
                console.log(data.results);
                //this.setState({ curPageIndex: curPage, totalData: data.totalData, stores: data.results, loading: false, refresh: !this.state.refresh });
                this.props.reflashStores({ totalData: data.totalData, stores: data.results, loading: false});
            });
    }

    addData = (store) => {
        fetch('/store/add', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(store)
        })
            .then(function (response) {
                return response.json();
            })
            .then(function (myJson) {
                alert(myJson.message);
            });
    }

    updateData = (store) => {
        fetch('/store/update', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(store)
        })
            .then(function (response) {
                return response.json();
            })
            .then(function (myJson) {
                alert(myJson.message);
            });
    }

    deleteData = (storeId) => {
        let url = '/store/delete/' + storeId;
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
                        this.props.deleteStore(storeId)
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

    paginate(curPageIndex = null) {
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
        this.props.updateQueryParams({ curPageIndex: thisCurPageIndex });  //put current page index into the store.
        return { totalData: totalData, dataPerPage: dataPerPage, curPageIndex: curPageIndex, skipData: skipData, maxPageNumber: maxPageNumber, beginPage: beginPage, endPage: endPage };
    }

    refreshList(curPageIndex=null) {
        let url = '/store/query/';
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
        console.log("Enter 'render' method!");
        console.log(this.props);
    return (
        <>
            <div className='listTitle'>
                <h1>Stores</h1>
            </div>
            <div className='listContent'>
                <StoreList {...this.props}
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
    console.log("enter 'mapStateToProps' method");
    console.log(state);
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