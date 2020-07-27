import {STORE_UPDATE_QUERY_PARAMETER, STORE_QUERY,STORE_ADD,STORE_UPDATE,STORE_DELETE} from './ActionTypes';
import IAction from './IAction';
import { IStoreState } from './IState';

const initState:IStoreState={
    nameQry: null,
    addressQry: null,
    stores: [],
    totalData: 0,
    dataPerPage: 2,
    curPageIndex: 1,
    maxPageNumber: 1,
    curPageLink: null,
    nextPageLink: null,
    prePageLink: null,
    loading: false
}

export default (state=initState,action:IAction):IStoreState=>{
    let newState:IStoreState=JSON.parse(JSON.stringify(state));
    switch(action.type){
        case STORE_UPDATE_QUERY_PARAMETER:
            newState={...newState,...action.value};
            break;
        case STORE_QUERY:
            newState={...newState,...action.value};
            break;
    }
    return newState;
}