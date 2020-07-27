import {SALE_UPDATE_QUERY_PARAMETER, SALE_QUERY,SALE_ADD,SALE_UPDATE,SALE_DELETE} from './ActionTypes';
import IAction from './IAction';
import { ISaleState } from './IState';

const initState:ISaleState={
    beginDateSoldQry: null,
    endDateSoldQry: null,
    customerId:null,
    productId:null,
    storeId:null,
    sales: [],
    totalData: 0,
    dataPerPage: 2,
    curPageIndex: 1,
    maxPageNumber: 1,
    curPageLink: null,
    nextPageLink: null,
    prePageLink: null,
    loading: false
}

export default (state=initState,action:IAction):ISaleState=>{
    let newState:ISaleState=JSON.parse(JSON.stringify(state));
    switch(action.type){
        case SALE_UPDATE_QUERY_PARAMETER:
            newState={...newState,...action.value};
            break;
        case SALE_QUERY:
            newState={...newState,...action.value};
            break;
    }
    return newState;
}