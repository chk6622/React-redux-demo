import React, {Component} from 'react';
import { Menu,Input,Button,Table } from 'semantic-ui-react';
import { connect } from 'react-redux';
import { GetAccessToken } from '../../helpers/UserHelper';
import { IStoreProps } from '../../redux/IProps';
import { updateStoreQueryParameterAction, queryStoreAction, deleteStoreAction } from '../../redux/StoreActions';
import DeleteButton from '../DeleteButton';


class ListStore extends Component<IStoreProps>{
    constructor(props:IStoreProps){
        super(props);
    }

    componentDidMount(){
        this.props.queryData();
    }

    render(){
        const {nameQry,addressQry,stores,maxPageNumber,curPageIndex,skipPage,updateQryParameters,queryData,deleteData}=this.props;

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
                            {/* <AddCustomerForm addData={this.props.addData} requeryData={() => this.props.refreshList(this.props.curPageIndex)} isOpen='true' /> */}
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
                                    stores?.map(
                                        (store:any) =>
                                        <Table.Row key={store.id}>
                                            <Table.Cell>{store.name}</Table.Cell>
                                            <Table.Cell>{store.address}</Table.Cell>
                                            <Table.Cell width='2' textAlign='center'>
                                                {/* <UpdateCustomerForm customer={customer} updateData={this.props.updateData} requeryData={() => this.props.refreshList(this.props.curPageIndex)} /> */}
                                            </Table.Cell>
                                            <Table.Cell width='2' textAlign='center'>
                                                <DeleteButton 
                                                    deleteData={() => deleteData(store.id)} 
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
        nameQry:state.StoreReducer.nameQry,
        addressQry:state.StoreReducer.addressQry,
        stores:state.StoreReducer.stores,
        totalData:state.StoreReducer.totalData,
        dataPerPage:state.StoreReducer.dataPerPage,
        curPageIndex:state.StoreReducer.curPageIndex,
        maxPageNumber:state.StoreReducer.maxPageNumber,
        curPageLink:state.StoreReducer.curPageLink,
        nextPageLink:state.StoreReducer.nextPageLink,
        prePageLink:state.StoreReducer.prePageLink,
        loading:state.StoreReducer.loading
    }
}

const dispatchToAction=(dispatch:any)=>{
    return {
        updateQryParameters(event:any){
            //debugger;
            let nam = event.target.name;
            let val = event.target.value;
            let newValue={
                [nam]:val
            }
            let action=updateStoreQueryParameterAction(newValue);
            dispatch(action);
        },
        skipPage(pageIndex:number){
            let newValue={
                'curPageIndex':pageIndex
            }
            //first: update curPageIndex
            let action=updateStoreQueryParameterAction(newValue);
            dispatch(action);
            
            //second: query store
            action = queryStoreAction(GetAccessToken());
            dispatch(action);
        },
        queryData(){
            console.log('query data from the database.');
            let action = queryStoreAction(GetAccessToken());
            dispatch(action);
        },
        deleteData(storeId:string){
            let action = deleteStoreAction(storeId,GetAccessToken());
            dispatch(action);
        }
    }
}

export default connect(stateToProps,dispatchToAction)(ListStore);