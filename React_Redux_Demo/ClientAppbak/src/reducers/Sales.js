//action types
const DELETE_SALES = 'DELETE_SALES';
const REFLASH_SALES = 'REFLASH_SALES';
const UPDATE_SALES_QUERY_PARAMS = 'UPDATE_SALES_QUERY_PARAMS';

//action creators

export const reflashSales = (sales) => {
    return { type: REFLASH_SALES, sales }
};

export const deleteSales = (deleteId) => {
    return { type: DELETE_SALES, deleteId }
};

export const updateQueryParams = (queryParams) => {
    return { type: UPDATE_SALES_QUERY_PARAMS, queryParams: queryParams }
};


//reducer
let initState = {
    sales: [],
    totalData: 0,
    dataPerPage: 5,
    curPageIndex: 1,
    skipData: 0,
    maxPageNumber: 1,
    beginPage: 1,
    endPage: 1};

export const reducer = (state = initState, action) => {

    let newState;
    switch (action.type) {
        case REFLASH_SALES:
            console.log('Excute reflash sales action');
            newState = {...state, ...action.sales };
            console.log(state);
            console.log(newState);
            return newState;
        case DELETE_SALES:
            console.log('Excute delete sales action');
            let sales = state.sales;
            let deleteId = action.deleteId;
            let index = -1;
            for (let i = 0; i < sales.length; i++) {
                let sale = sales[i];
                if (sale.id == deleteId) {
                    index = i;
                    break;
                }
            }
            let newSales = index == -1 ? [...sales] : [...sales.slice(0, index), ...sales.slice(index + 1)];
            newState = { ...state, sales:newSales };
            console.log(newState);
            return newState;
        case UPDATE_SALES_QUERY_PARAMS:
            newState = { ...state, ...action.queryParams };
            console.log(state);
            console.log(newState);
            return newState
        default:
            return state

    }
};

