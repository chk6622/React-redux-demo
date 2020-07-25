import {PRODUCT_UPDATE_QUERY_PARAMETER, PRODUCT_QUERY,PRODUCT_ADD,PRODUCT_UPDATE,PRODUCT_DELETE} from './ActionTypes';
import IAction from './IAction';
import { IProductState } from './IState';

const initState:IProductState={
    nameQry: null,
    priceQry: null,
    products: [],
    totalData: 0,
    dataPerPage: 2,
    curPageIndex: 1,
    maxPageNumber: 1,
    curPageLink: null,
    nextPageLink: null,
    prePageLink: null,
    loading: false
}

export default (state=initState,action:IAction):IProductState=>{
    let newState:IProductState=JSON.parse(JSON.stringify(state));
    switch(action.type){
        case PRODUCT_UPDATE_QUERY_PARAMETER:
            newState={...newState,...action.value};
            break;
        case PRODUCT_QUERY:
            newState={...newState,...action.value};
            break;
    }
    return newState;
}