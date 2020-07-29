import React, {Component} from 'react';
import { Menu,Button,Table } from 'semantic-ui-react';
import { connect } from 'react-redux';
import { GetAccessToken } from '../../helpers/UserHelper';
import { ISaleProps } from '../../redux/IProps';
import { updateSaleQueryParameterAction, querySaleAction, deleteSaleAction } from '../../redux/SaleActions';
import DropdownSearchQuery from '../DropdownSearchQuery';
import MyDatepicker from '../Datepicker';
import DeleteButton from '../DeleteButton';

class ListSale extends Component<ISaleProps>{
    constructor(props:ISaleProps){
        super(props);
        this.handleChange=this.handleChange.bind(this);
    }

    componentDidMount(){
        this.props.queryData();
    }

    handleChange(event:any){
        let name = event.target.name;
        let value = event.target.value;
        this.props.updateQryParameters(name,value);
    }

    render(){
        const {beginDateSoldQry,endDateSoldQry,customerId,productId,storeId,sales,maxPageNumber,curPageIndex,skipPage,updateQryParameters,queryData, deleteData}=this.props;

        let beginPage = 1; //paginationParams.beginPage;
        let endPage = maxPageNumber; //paginationParams.endPage;
        //let curPage = curPageIndex;

        let pages = new Array();
        //debugger
        for (let ind = beginPage; ind <= endPage; ind++) {
            pages.push(ind);
        }
        let customer, product, store;
        sales.map(
            (sale:any)=>{
                if(sale.customer.id===customerId){
                    customer=sale.customer;
                }
                if(sale.product.id===productId){
                    product=sale.product;
                }
                if(sale.store.id===storeId){
                    store=sale.store;
                }
            }
        )
        // console.log(`customer=${customer} customerId=${customerId}`);
        return (
            <>
            <div className='listContent'>
                <div className='queryBar'>
                    <div>
                        {/*<Input type='text' name='dateSoldQry' onChange={this.props.myChangeHandler} placeholder='Please input date sold.' />&nbsp;*/}
                        <MyDatepicker name='beginDateSoldQry' 
                            handleChangeHandler={updateQryParameters} 
                            initDate={beginDateSoldQry}
                            />
                             - 
                        <MyDatepicker name='endDateSoldQry' 
                            handleChangeHandler={updateQryParameters} 
                            initDate={endDateSoldQry}
                            />&nbsp;
                        <DropdownSearchQuery
                            myChangeHandler={updateQryParameters}
                            fetchDataUrl='/api/customers'
                            optionTextPropsName='name'
                            optionValuePropsName='id'
                            queryPropsName='nameQry'
                            returnPropsName='customerId'
                            placeholder='Please select a customer.'
                            initValue={customerId}
                            initOptions={customer?[customer]:null}
                        />&nbsp;
                        <DropdownSearchQuery
                            myChangeHandler={updateQryParameters}
                            fetchDataUrl='/api/products'
                            optionTextPropsName='name'
                            optionValuePropsName='id'
                            queryPropsName='nameQry'
                            returnPropsName='productId'
                            placeholder='Please select a product.'
                            initValue={productId}
                            initOptions={product?[product]:null}
                        />&nbsp;
                        <DropdownSearchQuery
                            myChangeHandler={updateQryParameters}
                            fetchDataUrl='/api/stores'
                            optionTextPropsName='name'
                            optionValuePropsName='id'
                            queryPropsName='nameQry'
                            returnPropsName='storeId'
                            placeholder='Please select a store.'
                            initValue={storeId}
                            initOptions={store?[store]:null}
                        />&nbsp;
                        <Button as='a' onClick={queryData}>Query</Button>
                    </div>
                    {/* <AddSalesForm requeryData={this.props.refreshList} addData={this.props.addData} /> */}
                </div>
                <Table celled selectable>
            <Table.Header>
                        {/*<Table.Row>
                    <Table.HeaderCell colSpan='6'>
                                <AddSalesForm requeryData={this.props.refreshList}/>
                    </Table.HeaderCell> 
                </Table.Row>*/}
                <Table.Row>
                    <Table.HeaderCell width='3'>DateSold</Table.HeaderCell>
                    <Table.HeaderCell width='3'>Customer</Table.HeaderCell>
                    <Table.HeaderCell width='3'>Product</Table.HeaderCell>
                    <Table.HeaderCell width='3'>Store</Table.HeaderCell>
                    <Table.HeaderCell colSpan='2' textAlign='center' width='4'>Option</Table.HeaderCell>
                    
                </Table.Row>
            </Table.Header>

            <Table.Body>
                {sales.map(
                    (sale:any) =>
                    <Table.Row key={sale.id}>
                        <Table.Cell>{sale.dateSold===null?'':sale.dateSold.substr(0, 10)}</Table.Cell>
                        <Table.Cell>{sale.customer === null ? '' : sale.customer.name}</Table.Cell>
                        <Table.Cell>{sale.product === null ? '' : sale.product.name}</Table.Cell>
                        <Table.Cell>{sale.store === null ? '' : sale.store.name}</Table.Cell>
                        <Table.Cell textAlign='center'>
                            {/* <UpdateSalesForm sale={sale} requeryData={this.props.refreshList} updateData={this.props.updateData} /> */}
                            </Table.Cell>
                        <Table.Cell textAlign='center'>
                            <DeleteButton 
                                deleteData={() => deleteData(sale.id)} 
                                />
                            </Table.Cell>
                    </Table.Row>
                )}
            </Table.Body>

                    <Table.Footer>
                        <Table.Row>
                            <Table.HeaderCell colSpan='6'>
                                <Menu floated='right' pagination>
                                    {pages.map(pageIndex =>
                                        <Menu.Item as='a' key={pageIndex} className={pageIndex === curPageIndex ? 'big' : 'normal'}  onClick={()=>{skipPage(pageIndex)}}>
                                            {pageIndex}
                                        </Menu.Item>
                                    )}
                                </Menu>
                            </Table.HeaderCell>
                        </Table.Row>
                    </Table.Footer>
                </Table>
                </div>
            </>
        );
    }
}

const stateToProps=(state:any)=>{
    return {
        beginDateSoldQry:state.SaleReducer.beginDateSoldQry,
        endDateSoldQry:state.SaleReducer.endDateSoldQry,
        customerId:state.SaleReducer.customerId,
        productId:state.SaleReducer.productId,
        storeId:state.SaleReducer.storeId,
        sales:state.SaleReducer.sales,
        totalData:state.SaleReducer.totalData,
        dataPerPage:state.SaleReducer.dataPerPage,
        curPageIndex:state.SaleReducer.curPageIndex,
        maxPageNumber:state.SaleReducer.maxPageNumber,
        curPageLink:state.SaleReducer.curPageLink,
        nextPageLink:state.SaleReducer.nextPageLink,
        prePageLink:state.SaleReducer.prePageLink,
        loading:state.SaleReducer.loading
    }
}

const dispatchToAction=(dispatch:any)=>{
    return {
        updateQryParameters(name:any,value:any){
            debugger;
            let newValue={
                [name]:value
            }
            let action=updateSaleQueryParameterAction(newValue);
            dispatch(action);
        },
        skipPage(pageIndex:number){
            let newValue={
                'curPageIndex':pageIndex
            }
            //first: update curPageIndex
            let action=updateSaleQueryParameterAction(newValue);
            dispatch(action);
            
            //second: query sale
            action = querySaleAction(GetAccessToken());
            dispatch(action);
        },
        queryData(){
            console.log('query data from the database.');
            let action = querySaleAction(GetAccessToken());
            dispatch(action);
        },
        deleteData(saleId:string){
            let action = deleteSaleAction(saleId,GetAccessToken());
            dispatch(action);
        }
    }
}

export default connect(stateToProps,dispatchToAction)(ListSale);