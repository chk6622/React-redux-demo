//action types
const DELETE_PRODUCT = 'DELETE_PRODUCT';
const REFLASH_PRODUCTS = 'REFLASH_PRODUCTS';
const UPDATE_PRODUCT_QUERY_PARAMS = 'UPDATE_PRODUCT_QUERY_PARAMS';

//action creators
export const reflashProducts = (products) => {
    return { type: REFLASH_PRODUCTS, products }
};

export const deleteProduct = (deleteId) => {
    return { type: DELETE_PRODUCT, deleteId }
};

export const updateProductQueryParams = (queryParams) => {
    return { type: UPDATE_PRODUCT_QUERY_PARAMS, queryParams: queryParams }
};


//reducer
let initState = {
    products: [],
    totalData: 0,
    dataPerPage: 5,
    curPageIndex: 1,
    skipData: 0,
    maxPageNumber: 1,
    beginPage: 1,
    endPage: 1};

export const reducer = (state = initState, action) => {
    //console.log(action.type);
    let newState;
    switch (action.type) {
        case REFLASH_PRODUCTS:
            console.log('Excute reflash products action');
            newState = {...state, ...action.products };
            console.log(state);
            console.log(newState);
            return newState;
        case DELETE_PRODUCT:
            console.log('Excute delete product action');
            let products = state.products;
            let deleteId = action.deleteId;
            let index = -1;
            for (let i = 0; i < products.length; i++) {
                let product = products[i];
                if (product.id == deleteId) {
                    index = i;
                    break;
                }
            }
            let newProducts = index == -1 ? [...products] : [...products.slice(0, index), ...products.slice(index + 1)];
            newState = { ...state, products: newProducts };
            console.log(newState);
            return newState;
        case UPDATE_PRODUCT_QUERY_PARAMS:
            newState = { ...state, ...action.queryParams };
            console.log(state);
            console.log(newState);
            return newState
        default:
            return state

    }
};

