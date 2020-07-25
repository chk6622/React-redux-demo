import { ICustomerState, IProductState, IStoreState, ISaleState } from './IState';

export interface IAppMenuProps{
    activeItem:string,
    isOpen:boolean,
    handleItemClick:any,
    confirmAndDo:any,
    closeConfirm:any,
    openConfirm:any
}

interface IBaseProps{
    updateQryParameters:any,
    skipPage:any,
    queryData:any,
    addData:any,
    updateData:any,
    deleteData:any,
}

export interface ICustomerProps extends IBaseProps,ICustomerState{
    
}

export interface IProductProps extends IBaseProps,IProductState{

}

export interface IStoreProps extends IBaseProps,IStoreState{

}

export interface ISaleProps extends IBaseProps,ISaleState{
    
}