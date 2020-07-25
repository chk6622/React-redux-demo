import {CUSTOMER_UPDATE_QUERY_PARAMETER, CUSTOMER_QUERY,CUSTOMER_ADD,CUSTOMER_UPDATE,CUSTOMER_DELETE} from './ActionTypes';
import IAction from './IAction';
import { ICustomerState } from './IState';

const initState:ICustomerState={
    nameQry: null,
    addressQry: null,
    customers: [],
    totalData: 0,
    dataPerPage: 2,
    curPageIndex: 1,
    maxPageNumber: 1,
    curPageLink: null,
    nextPageLink: null,
    prePageLink: null,
    loading: false
}

export default (state=initState,action:IAction):ICustomerState=>{
    let newState:ICustomerState=JSON.parse(JSON.stringify(state));
    switch(action.type){
        case CUSTOMER_UPDATE_QUERY_PARAMETER:
            newState={...newState,...action.value};
            break;
        case CUSTOMER_QUERY:
            newState={...newState,...action.value};
            break;
    }
    return newState;
}