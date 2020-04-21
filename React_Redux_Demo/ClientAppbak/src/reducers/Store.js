//action types
const DELETE_STORE = 'DELETE_STORE';
const REFLASH_STORES = 'REFLASH_STORES';
const UPDATE_STORE_QUERY_PARAMS = 'UPDATE_STORE_QUERY_PARAMS';

//action creators

export const reflashStores = (stores) => {
    return { type: REFLASH_STORES, stores }
};

export const deleteStore = (deleteId) => {
    return { type: DELETE_STORE, deleteId }
};

export const updateQueryParams = (queryParams) => {
    return { type: UPDATE_STORE_QUERY_PARAMS, queryParams: queryParams }
};


//reducer
let initState = {
    stores: [],
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
        case REFLASH_STORES:
            console.log('Excute reflash stores action');
            newState = {...state, ...action.stores };
            console.log(state);
            console.log(newState);
            return newState;
        case DELETE_STORE:
            console.log('Excute delete stores action');
            let stores = state.stores;
            let deleteId = action.deleteId;
            let index = -1;
            for (let i = 0; i < stores.length; i++) {
                let store = stores[i];
                if (store.id == deleteId) {
                    index = i;
                    break;
                }
            }
            let newStores = index == -1 ? [...stores] : [...stores.slice(0, index), ...stores.slice(index + 1)];
            newState = { ...state, stores:newStores };
            console.log(newState);
            return newState;
        case UPDATE_STORE_QUERY_PARAMS:
            newState = { ...state, ...action.queryParams };
            console.log(state);
            console.log(newState);
            return newState
        default:
            return state

    }
};

