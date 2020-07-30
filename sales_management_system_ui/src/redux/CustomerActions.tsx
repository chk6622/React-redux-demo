import {CUSTOMER_UPDATE_PARAMETER, CUSTOMER_QUERY, CUSTOMER_ADD, CUSTOMER_UPDATE, CUSTOMER_DELETE} from './ActionTypes';
import IAction from './IAction';
import HttpHelper from '../helpers/HttpHelper';
import environment from '../environment/environment';
import tool from '../Tool';
import { GetAccessToken } from '../helpers/UserHelper';

export const updateCustomerParameterAction=(value:any):IAction=>{
    //debugger;
    const action = {
        type:CUSTOMER_UPDATE_PARAMETER,
        value:value
    }
    return action;
}

function getQueryParamsUrl(queryUrl:any,nameQry:any, addressQry:any) {
    if (!tool.isNullString(nameQry)) {
        queryUrl += '&nameQry=' + nameQry;
    }
    if (!tool.isNullString(addressQry)) {
        queryUrl += '&addressQry=' + addressQry;
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
    let url:string = `${apiUrl}/api/customers`;
    url = getPaginatedUrl(url,pageIndex);
    url = getQueryParamsUrl(url,nameQry,addressQry);
    return url;
}

export const queryCustomerAction=(accessToken:any):any=>{
    
    // return action;
    return (dispatch:any,getState:any)=>{
        var httpHelper = HttpHelper.getInstance();
        
        const state=getState();

        let nameQry=state.CustomerReducer.nameQry;
        let addressQry=state.CustomerReducer.addressQry;
        let curPageIndex=state.CustomerReducer.curPageIndex;
        
        
        let url = getUrl(curPageIndex,nameQry,addressQry);
        queryDataByHttp(httpHelper,url,accessToken,dispatch);
    };
}

export const addCustomerAction=(customer:string,accessToken:any):any=>{
    return (
        async (dispatch:any,getState:any)=>{
            let httpHelper = HttpHelper.getInstance();
            const state=getState();
            let nameQry=state.CustomerReducer.nameQry;
            let addressQry=state.CustomerReducer.addressQry;
            let curPageIndex=state.CustomerReducer.curPageIndex;

            let apiUrl = environment.apiBase;
            let url = `${apiUrl}/api/customers`;

            await httpHelper.post(url, accessToken, customer)
                .then(data => {
                    alert(data['msg']);
                });

            url = getUrl(curPageIndex,nameQry,addressQry);
            queryDataByHttp(httpHelper, url, accessToken, dispatch);
        }
    );
}

export const updateCustomerAction=(customer:any,accessToken:any):any=>{
    
    return (
        async (dispatch:any,getState:any)=>{
            let httpHelper = HttpHelper.getInstance();
            const state=getState();
            let nameQry=state.CustomerReducer.nameQry;
            let addressQry=state.CustomerReducer.addressQry;
            let curPageIndex=state.CustomerReducer.curPageIndex;

            let apiUrl = environment.apiBase;
            let url = `${apiUrl}/api/customers/${customer.id}`;
            console.log(`execute Update ${url}`);
            await httpHelper.put(url, GetAccessToken(), customer)
                .then(data => {
                    alert(data['msg']);
                });

            url = getUrl(curPageIndex,nameQry,addressQry);
            queryDataByHttp(httpHelper, url, accessToken, dispatch);
        }
    );
}

export  const deleteCustomerAction=(customerId:any,accessToken:any):any=>{
    return (
        async (dispatch:any,getState:any)=>{
            let httpHelper = HttpHelper.getInstance();
            const state=getState();
            let nameQry=state.CustomerReducer.nameQry;
            let addressQry=state.CustomerReducer.addressQry;
            let curPageIndex=state.CustomerReducer.curPageIndex;

            let apiUrl = environment.apiBase;
            let url = `${apiUrl}/api/customers/${customerId}`;
            console.log(`execute delete ${url}`);
            await httpHelper.delete(url, accessToken)
                .then(message => {
                    alert(message);
                });
                
                
            url = getUrl(curPageIndex,nameQry,addressQry);
            queryDataByHttp(httpHelper, url, accessToken, dispatch);
        }
    );
}

async function queryDataByHttp(httpHelper: HttpHelper, url: string, accessToken: any, dispatch: any) {
    httpHelper.get(url, accessToken)
        .then((data: any) => {
            let body: any = data['body'];
            let pagination: any = data['pagination'];
            let customers = body?.value;
            let curPageLink = body?.links?.find((link: any) => link.rel === 'self');
            let nextPageLink = body?.links?.find((link: any) => link.rel === 'get_next_page');
            let prePageLink = body?.links?.find((link: any) => link.rel === 'get_previous_page');
            pagination = JSON.parse(pagination);
            let value = {
                customers: customers,
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
                type: CUSTOMER_QUERY,
                value
            };
            dispatch(action);
        });
}
