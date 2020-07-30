import React,{Component} from 'react';
import { Menu, Confirm,Input,Button,Table } from 'semantic-ui-react';
import {connect} from 'react-redux';
import HttpHelper from '../../helpers/HttpHelper';
import environment from '../../environment/environment';
import { GetAccessToken } from '../../helpers/UserHelper';
import { ICustomerProps } from '../../redux/IProps';
import { updateCustomerParameterAction, queryCustomerAction, deleteCustomerAction, addCustomerAction, updateCustomerAction } from '../../redux/CustomerActions';
import DeleteButton from '../DeleteButton';
import AddCustomer from './AddCustomer';
import EditCustomer from './EditCustomer';


class ListCustomer extends Component<ICustomerProps>{
    constructor(props:ICustomerProps){
        super(props);
    }

    componentDidMount(){
       this.props.queryData();
    }

    render(){
        const {nameQry,addressQry,customers,maxPageNumber,curPageIndex,skipPage,updateQryParameters,queryData,addData,updateData,deleteData}=this.props;

        let beginPage = 1; //paginationParams.beginPage;
        let endPage = maxPageNumber; //paginationParams.endPage;
        //let curPage = curPageIndex;

        let pages = new Array();
        //debugger
        for (let ind = beginPage; ind <= endPage; ind++) {
            pages.push(ind);
        }

        
        return (
            <>
            <div className='listContent'>
                        <div className='queryBar'>
                            <div>
                                <Input type='text' name='nameQry' value={nameQry} onChange={updateQryParameters} placeholder='Please input name.' />&nbsp;
                                <Input type='text' name='addressQry' value={addressQry} onChange={updateQryParameters} placeholder='Please input address.' />&nbsp;
                                <Button as='a' onClick={queryData}>Query</Button>
                            </div>
                            <AddCustomer 
                                addData={addData} 
                                isOpen={false}
                            />
                        </div>

                        <Table celled selectable>
                            <Table.Header>
                                <Table.Row>
                                    <Table.HeaderCell width='3'>Name</Table.HeaderCell>
                                    <Table.HeaderCell width='9'>Address</Table.HeaderCell>
                                    <Table.HeaderCell colspan='2' textAlign='center' width='4'>Option</Table.HeaderCell>
                                </Table.Row>
                            </Table.Header>

                            <Table.Body>
                                {
                                    customers?.map(
                                        (customer:any) =>
                                        <Table.Row key={customer.id}>
                                            <Table.Cell>{customer.name}</Table.Cell>
                                            <Table.Cell>{customer.address}</Table.Cell>
                                            <Table.Cell width='2' textAlign='center'>
                                                <EditCustomer 
                                                    customer={customer} 
                                                    updateData={updateData} 
                                                    isOpen={false}
                                                />
                                            </Table.Cell>
                                            <Table.Cell width='2' textAlign='center'>
                                                <DeleteButton 
                                                    deleteData={() => deleteData(customer.id)} 
                                                />
                                            </Table.Cell>
                                        </Table.Row>
                                    )}
                            </Table.Body>

                            <Table.Footer>
                                <Table.Row>
                                    <Table.HeaderCell colSpan='4'>
                                        <Menu floated='right' pagination>
                                            {pages.map(pageIndex =>
                                                <Menu.Item as='a' key={pageIndex} className={pageIndex === curPageIndex ? 'big' : 'normal'} onClick={()=>{skipPage(pageIndex)}}>
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
        nameQry:state.CustomerReducer.nameQry,
        addressQry:state.CustomerReducer.addressQry,
        customers:state.CustomerReducer.customers,
        totalData:state.CustomerReducer.totalData,
        dataPerPage:state.CustomerReducer.dataPerPage,
        curPageIndex:state.CustomerReducer.curPageIndex,
        maxPageNumber:state.CustomerReducer.maxPageNumber,
        curPageLink:state.CustomerReducer.curPageLink,
        nextPageLink:state.CustomerReducer.nextPageLink,
        prePageLink:state.CustomerReducer.prePageLink,
        loading:state.CustomerReducer.loading
    }
}

const dispatchToAction=(dispatch:any)=>{
    return {
        updateParameters(event:any){
            //debugger;
            let nam = event.target.name;
            let val = event.target.value;
            let newValue={
                [nam]:val
            }
            let action=updateCustomerParameterAction(newValue);
            dispatch(action);
        },
        skipPage(pageIndex:number){
            let newValue={
                'curPageIndex':pageIndex
            }
            //first: update curPageIndex
            let action=updateCustomerParameterAction(newValue);
            dispatch(action);
            
            //second: query customer
            action = queryCustomerAction(GetAccessToken());
            dispatch(action);
        },
        queryData(){
            console.log('query data from the database.');
            let action = queryCustomerAction(GetAccessToken());
            dispatch(action);
        },
        addData(customer:string){
            let action = addCustomerAction(customer,GetAccessToken());
            dispatch(action);
        },
        updateData(customer:string){
            let action = updateCustomerAction(customer,GetAccessToken());
            dispatch(action);
        },
        deleteData(customerId:string){
            console.log('delete data!');
            let action = deleteCustomerAction(customerId,GetAccessToken());
            dispatch(action);

            //second: query customer
            //action = queryCustomerAction(GetAccessToken());
            //dispatch(action);
        }
    }
}

export default connect(stateToProps,dispatchToAction)(ListCustomer);
