import {PRODUCT_UPDATE_QUERY_PARAMETER, PRODUCT_QUERY, PRODUCT_ADD, PRODUCT_UPDATE, PRODUCT_DELETE} from './ActionTypes';
import IAction from './IAction';
import HttpHelper from '../helpers/HttpHelper';
import environment from '../environment/environment';
import tool from '../Tool';

export const updateProductQueryParameterAction=(value:any):IAction=>{
    //debugger;
    const action = {
        type:PRODUCT_UPDATE_QUERY_PARAMETER,
        value:value
    }
    return action;
}

function getQueryParamsUrl(queryUrl:any,nameQry:any, priceQry:any) {
    if (!tool.isNullString(nameQry)) {
        queryUrl += '&nameQry=' + nameQry;
    }
    if (!tool.isNullString(priceQry)) {
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

function getUrl(pageIndex:any=1,nameQry:string,priceQry:string):string{
    let apiUrl = environment.apiBase;
    let url:string = `${apiUrl}/api/products`;
    url = getPaginatedUrl(url,pageIndex);
    url = getQueryParamsUrl(url,nameQry,priceQry);
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
        // debugger
        
        
        let url = getUrl(curPageIndex,nameQry,priceQry);

        console.log(`execute query ${url}`);
        queryDataByHttp(httpHelper, url, accessToken, dispatch);
    };
}

export const addProductAction=(product:any,accessToken:any):any=>{
    return (
        async (dispatch:any,getState:any)=>{
            let httpHelper = HttpHelper.getInstance();
            const state=getState();
            let nameQry=state.ProductReducer.nameQry;
            let priceQry=state.ProductReducer.priceQry;
            let curPageIndex=state.ProductReducer.curPageIndex;

            let apiUrl = environment.apiBase;
            let url = `${apiUrl}/api/products`;

            await httpHelper.post(url, accessToken, product)
                .then(data => {
                    alert(data['msg']);
                });

            url = getUrl(curPageIndex,nameQry,priceQry);
            queryDataByHttp(httpHelper, url, accessToken, dispatch);
        }
    );
}

export const updateProductAction=(product:any,accessToken:any):any=>{
    return (
        async (dispatch:any,getState:any)=>{
            let httpHelper = HttpHelper.getInstance();
            const state=getState();
            let nameQry=state.ProductReducer.nameQry;
            let priceQry=state.ProductReducer.priceQry;
            let curPageIndex=state.ProductReducer.curPageIndex;

            let apiUrl = environment.apiBase;
            let url = `${apiUrl}/api/products/${product.id}`;

            await httpHelper.put(url, accessToken, product)
                .then(data => {
                    alert(data['msg']);
                });

            url = getUrl(curPageIndex,nameQry,priceQry);
            queryDataByHttp(httpHelper, url, accessToken, dispatch);
        }
    );
}

export const deleteProductAction=(productId:any,accessToken:any):any=>{
    return (
        async (dispatch:any,getState:any)=>{
            let httpHelper = HttpHelper.getInstance();
            const state = getState();
            let nameQry=state.ProductReducer.nameQry;
            let priceQry=state.ProductReducer.priceQry;
            let curPageIndex=state.ProductReducer.curPageIndex;

            let apiUrl = environment.apiBase;
            let url = `${apiUrl}/api/products/${productId}`;
            console.log(`execute delete ${url}`);
            await httpHelper.delete(url, accessToken)
                .then(message => {
                    alert(message);
                });
                
                
            url = getUrl(curPageIndex,nameQry,priceQry);
            await queryDataByHttp(httpHelper, url, accessToken, dispatch);
        }
    );
}

function queryDataByHttp(httpHelper: HttpHelper, url: string, accessToken: any, dispatch: any) {
    httpHelper.get(url, accessToken)
        .then((data: any) => {

            let body: any = data['body'];
            let pagination: any = data['pagination'];
            let location = data['location'];
            let products = body?.value;
            let curPageLink = body?.links?.find((link: any) => link.rel === 'self');
            let nextPageLink = body?.links?.find((link: any) => link.rel === 'get_next_page');
            let prePageLink = body?.links?.find((link: any) => link.rel === 'get_previous_page');
            // console.log('=========================');
            // console.log(products);
            // console.log(pagination);
            // console.log(location);
            // console.log(curPageLink);
            // console.log(nextPageLink);
            // console.log(prePageLink);
            // console.log('=========================');
            pagination = JSON.parse(pagination);
            let value = {
                products,
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
                type: PRODUCT_QUERY,
                value
            };
            dispatch(action);
        });
}
