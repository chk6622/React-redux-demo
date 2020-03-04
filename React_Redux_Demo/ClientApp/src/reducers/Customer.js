//action types
const INIT_CUSTOMERS = 'INIT_CUSTOMERS';
const ADD_CUSTOMER = 'ADD_CUSTOMER';
const DELETE_CUSTOMER = 'DELETE_CUSTOMER';
const REFLASH_CUSTOMERS = 'REFLASH_CUSTOMERS';
const UPDATE_QUERY_PARAMS = 'UPDATE_QUERY_PARAMS';

//action creators
export const initCustomers = (customers) => {
    return { type: INIT_CUSTOMERS, customers }
};

export const reflashCustomers = (customers) => {
    return { type: REFLASH_CUSTOMERS, customers }
};

export const addCustomer = (customer) => {
    return { type: ADD_CUSTOMER, customer }
};

export const deleteCustomer = (deleteId) => {
    return { type: DELETE_CUSTOMER, deleteId }
};

export const updateQueryParams = (queryParams) => {
    return { type: UPDATE_QUERY_PARAMS, queryParams: queryParams }
};


//reducer
let initState = {
    customers: [],
    totalData: 0,
    dataPerPage: 5,
    curPageIndex: 1,
    skipData: 0,
    maxPageNumber: 1,
    beginPage: 1,
    endPage: 1};

export const reducer = (state = initState, action) => {
    /*if (!state) {
        state = initState
    }*/
    let newState;
    switch (action.type) {
        case INIT_CUSTOMERS:
            return { ...action.customers }
        case REFLASH_CUSTOMERS:
            console.log('Excute reflash customers action');
            newState = {...state, ...action.customers };
            console.log(state);
            console.log(newState);
            return newState;
        case ADD_CUSTOMER:
            return { customers: [...state.customers, action.customer] }
        case DELETE_CUSTOMER:
            console.log('Excute delete customers action');
            let customers = state.customers;
            let deleteId = action.deleteId;
            let index = -1;
            for (let i = 0; i < customers.length; i++) {
                let customer = customers[i];
                if (customer.id == deleteId) {
                    index = i;
                    break;
                }
            }
            let newCustomers = index == -1 ? [...customers] : [...customers.slice(0, index), ...customers.slice(index + 1)];
            newState = { ...state, customers:newCustomers };
            console.log(newState);
            return newState;
        case UPDATE_QUERY_PARAMS:
            newState = { ...state, ...action.queryParams };
            console.log(state);
            console.log(newState);
            return newState
        default:
            return state

    }
};

