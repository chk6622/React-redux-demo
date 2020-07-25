export interface IAppMenuState{
    activeItem:string,
    isOpen:boolean
}

export interface ICustomerState{
    nameQry:string|null,
    addressQry:string|null,
    customers: any,
    totalData: number,
    dataPerPage: number,
    curPageIndex: number,
    maxPageNumber: number,
    curPageLink: string|null,
    nextPageLink: string|null,
    prePageLink: string|null,
    loading: boolean
}

export interface IProductState{
    nameQry:string|null,
    priceQry:string|null,
    products: any,
    totalData: number,
    dataPerPage: number,
    curPageIndex: number,
    maxPageNumber: number,
    curPageLink: string|null,
    nextPageLink: string|null,
    prePageLink: string|null,
    loading: boolean
}

export interface IStoreState{
    nameQry:string|null,
    addressQry:string|null,
    stores: any,
    totalData: number,
    dataPerPage: number,
    curPageIndex: number,
    maxPageNumber: number,
    curPageLink: string|null,
    nextPageLink: string|null,
    prePageLink: string|null,
    loading: boolean
}

export interface ISaleState{
    beginDateSoldQry:string|null,
    endDateSoldQry:string|null,
    customerId:string|null,
    productId:string|null,
    storeId:string|null,
    sales: any,
    totalData: number,
    dataPerPage: number,
    curPageIndex: number,
    maxPageNumber: number,
    curPageLink: string|null,
    nextPageLink: string|null,
    prePageLink: string|null,
    loading: boolean
}

