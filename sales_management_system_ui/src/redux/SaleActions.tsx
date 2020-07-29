import {SALE_UPDATE_QUERY_PARAMETER, SALE_QUERY, SALE_ADD, SALE_UPDATE, SALE_DELETE} from './ActionTypes';
import IAction from './IAction';
import HttpHelper from '../helpers/HttpHelper';
import environment from '../environment/environment';


export const updateSaleQueryParameterAction=(value:any):IAction=>{
    //debugger;
    const action = {
        type:SALE_UPDATE_QUERY_PARAMETER,
        value:value
    }
    return action;
}

function getQueryParamsUrl(queryUrl:any,beginDateSoldQry:any, endDateSoldQry:any, customerId:any, productId:any, storeId:any) {
    if (beginDateSoldQry !== null && beginDateSoldQry !== '') {
        queryUrl += '&beginDateSoldQry=' + beginDateSoldQry;
    }
    if (endDateSoldQry !== null && endDateSoldQry !== '') {
        queryUrl += '&endDateSoldQry=' + endDateSoldQry;
    }
    if (customerId !== null && customerId !== '') {
        queryUrl += '&customerId=' + customerId;
    }
    if (productId !== null && productId !== '') {
        queryUrl += '&productId=' + productId;
    }
    if (storeId !== null && storeId !== '') {
        queryUrl += '&storeId=' + storeId;
    }
    return queryUrl;
}

function getPaginatedUrl(url:string,pageNumber:number=1,pageSize:number=2) { 
    pageNumber = pageNumber < 1 ? 1 : pageNumber;
    pageSize = pageSize<1? 10:pageSize;
    url = `${url}?PageNumber=${pageNumber}&PageSize=${pageSize}`;
    return url;
}

function getUrl(pageIndex:any=1,beginDateSoldQry:any, endDateSoldQry:any, customerId:any, productId:any, storeId:any):string{
    let apiUrl = environment.apiBase;
    let url:string = `${apiUrl}/api/sales`;
    url = getPaginatedUrl(url,pageIndex);
    url = getQueryParamsUrl(url,beginDateSoldQry, endDateSoldQry, customerId, productId, storeId);
    return url;
}

export const querySaleAction=(accessToken:any):any=>{
    
    // return action;
    return (dispatch:any,getState:any)=>{
        var httpHelper = HttpHelper.getInstance();
        const state=getState();

        let beginDateSoldQry=state.SaleReducer.beginDateSoldQry;
        let endDateSoldQry=state.SaleReducer.endDateSoldQry;
        let customerId=state.SaleReducer.customerId;
        let productId=state.SaleReducer.productId;
        let storeId=state.SaleReducer.storeId;
        let curPageIndex=state.SaleReducer.curPageIndex;
        //debugger
        
        
        let url = getUrl(curPageIndex,beginDateSoldQry, endDateSoldQry, customerId, productId, storeId);

        console.log(`execute query ${url}`);
        queryDataByHttp(httpHelper, url, accessToken, dispatch);
    };
}

export const addSaleAction=(value:any):IAction=>{
    const action = {
        type:SALE_ADD,
        value:value
    }
    return action;
}

export const updateSaleAction=(value:any):IAction=>{
    const action = {
        type:SALE_UPDATE,
        value:value
    }
    return action;
}

export const deleteSaleAction=(saleId:string, accessToken:string):any=>{
    return (
        async (dispatch:any,getState:any)=>{
            let httpHelper = HttpHelper.getInstance();
            const state=getState();
            let beginDateSoldQry=state.SaleReducer.beginDateSoldQry;
            let endDateSoldQry=state.SaleReducer.endDateSoldQry;
            let customerId=state.SaleReducer.customerId;
            let productId=state.SaleReducer.productId;
            let storeId=state.SaleReducer.storeId;
            let curPageIndex=state.SaleReducer.curPageIndex;

            let apiUrl = environment.apiBase;
            let url = `${apiUrl}/api/sales/${saleId}`;
            console.log(`execute delete ${url}`);
            await httpHelper.delete(url, accessToken)
                .then(message => {
                    alert(message);
                });
                
                
               
                //debugger
                
                
            url = getUrl(curPageIndex,beginDateSoldQry, endDateSoldQry, customerId, productId, storeId);
        
            queryDataByHttp(httpHelper, url, accessToken, dispatch);
        }
    );
}

function queryDataByHttp(httpHelper: HttpHelper, url: string, accessToken: any, dispatch: any) {
    httpHelper.get(url, accessToken)
        .then((data: any) => {

            let body: any = data['body'];
            let pagination: any = data['pagination'];
            let location = data['location'];
            let sales = body?.value;
            debugger;
            let curPageLink = body?.links?.find((link: any) => link.rel === 'self');
            let nextPageLink = body?.links?.find((link: any) => link.rel === 'get_next_page');
            let prePageLink = body?.links?.find((link: any) => link.rel === 'get_previous_page');
            console.log('=========================');
            console.log(sales);
            console.log(pagination);
            console.log(location);
            console.log(curPageLink);
            console.log(nextPageLink);
            console.log(prePageLink);
            console.log('=========================');
            pagination = JSON.parse(pagination);
            let value = {
                sales,
                totalData: pagination == null ? null : pagination['totalCount'],
                dataPerPage: pagination == null ? null : pagination['pageSize'],
                curPageIndex: pagination == null ? null : pagination['currentPage'],
                maxPageNumber: pagination == null ? null : pagination['totalPages'],
                curPageLink: curPageLink == null ? null : curPageLink,
                nextPageLink: curPageLink == null ? null : nextPageLink,
                prePageLink: curPageLink == null ? null : prePageLink,
                loading: false
            };
            const action = {
                type: SALE_QUERY,
                value
            };
            dispatch(action);
        });
}
