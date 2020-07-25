import {PRODUCT_UPDATE_QUERY_PARAMETER, PRODUCT_QUERY, PRODUCT_ADD, PRODUCT_UPDATE, PRODUCT_DELETE} from './ActionTypes';
import IAction from './IAction';
import HttpHelper from '../helpers/HttpHelper';
import environment from '../environment/environment';

export const updateProductQueryParameterAction=(value:any):IAction=>{
    //debugger;
    const action = {
        type:PRODUCT_UPDATE_QUERY_PARAMETER,
        value:value
    }
    return action;
}

function getQueryParamsUrl(queryUrl:any,nameQry:any, priceQry:any) {
    if (nameQry !== null && nameQry !== '') {
        queryUrl += '&nameQry=' + nameQry;
    }
    if (priceQry !== null && priceQry !== '') {
        queryUrl += '&priceQry=' + priceQry;
    }
    return queryUrl;
}

function getPaginatedUrl(url:string,pageNumber:number=1,pageSize:number=2) { 
    pageNumber = pageNumber < 1 ? 1 : pageNumber;
    pageSize = pageSize<1? 10:pageSize;
    url = `${url}?PageNumber=${pageNumber}&PageSize=${pageSize}`;
    return url;
}

function getUrl(pageIndex:any=1,nameQry:string,addressQry:string):string{
    let apiUrl = environment.apiBase;
    let url:string = `${apiUrl}/api/products`;
    url = getPaginatedUrl(url,pageIndex);
    url = getQueryParamsUrl(url,nameQry,addressQry);
    return url;
}

export const queryProductAction=(accessToken:any):any=>{
    
    // return action;
    return (dispatch:any,getState:any)=>{
        var httpHelper = HttpHelper.getInstance();
        const state=getState();

        let nameQry=state.ProductReducer.nameQry;
        let priceQry=state.ProductReducer.priceQry;
        let curPageIndex=state.ProductReducer.curPageIndex;
        debugger
        
        
        let url = getUrl(curPageIndex,nameQry,priceQry);

        console.log(`execute query ${url}`);
        httpHelper.get(url, accessToken)
            .then((data:any) => {
                
                let body:any = data['body'];
                let pagination:any = data['pagination'];
                let location = data['location'];
                let products = body?.value;
                let curPageLink = body?.links?.find((link:any) => link.rel === 'self');
                let nextPageLink = body?.links?.find((link:any) => link.rel === 'get_next_page');
                let prePageLink = body?.links?.find((link:any) => link.rel === 'get_previous_page');
                console.log('=========================');
                console.log(products);
                console.log(pagination);
                console.log(location);
                console.log(curPageLink);
                console.log(nextPageLink);
                console.log(prePageLink);
                console.log('=========================');
                pagination=JSON.parse(pagination);
                let value={
                    products,
                    totalData: pagination==null?null:pagination['totalCount'],
                    dataPerPage: pagination == null ? null :pagination['pageSize'],
                    curPageIndex: pagination == null ? null :pagination['currentPage'],
                    maxPageNumber: pagination == null ? null : pagination['totalPages'],
                    curPageLink: curPageLink==null?null:curPageLink,
                    nextPageLink: curPageLink == null ? null :nextPageLink,
                    prePageLink: curPageLink == null ? null :prePageLink,
                    loading: false
                };
                const action = {
                    type:PRODUCT_QUERY,
                    value
                };
                dispatch(action);
            })
    };
}

export const addProductAction=(value:any):IAction=>{
    const action = {
        type:PRODUCT_ADD,
        value:value
    }
    return action;
}

export const updateProductAction=(value:any):IAction=>{
    const action = {
        type:PRODUCT_UPDATE,
        value:value
    }
    return action;
}

export const deleteProductAction=(value:any):IAction=>{
    const action = {
        type:PRODUCT_DELETE,
        value:value
    }
    return action;
}