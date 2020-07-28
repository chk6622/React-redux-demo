import React, {Component} from 'react';
import {connect} from 'react-redux';
import { Menu, Input,Button,Table } from 'semantic-ui-react';
import { GetAccessToken } from '../../helpers/UserHelper';
import { IProductProps } from '../../redux/IProps';
import {updateProductQueryParameterAction,queryProductAction,deleteProductAction} from '../../redux/ProductActions';
import DeleteButton from '../DeleteButton';

class ListProduct extends Component<IProductProps>{
    constructor(props:IProductProps){
        super(props);
    }

    componentDidMount(){
        this.props.queryData();
    }

    render(){
        const {nameQry,priceQry,products,maxPageNumber,curPageIndex,skipPage,updateQryParameters,queryData,deleteData}=this.props;

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
                        <Input type='text' name='priceQry' value={priceQry} onChange={updateQryParameters} placeholder='Please input price.' />&nbsp;
                        <Button as='a' onClick={queryData}>Query</Button>
                    </div>
                    {/* <AddProductForm addData={this.props.addData} requeryData={() => this.props.refreshList(this.props.curPageIndex)} isOpen='true' /> */}
                </div>
                <Table celled selectable>
                <Table.Header>
                        {/*<Table.Row>
                        <Table.HeaderCell colSpan='4'>
                                <AddProductForm addData={this.props.addData} requeryData={() => this.props.refreshList(this.props.curPageIndex)} isOpen='true' />
                        </Table.HeaderCell>
                    </Table.Row>*/}
                    <Table.Row>
                        <Table.HeaderCell width='8'>Name</Table.HeaderCell>
                        <Table.HeaderCell width='4'>Price</Table.HeaderCell>
                            <Table.HeaderCell colspan='2' textAlign='center' width='4'>Option</Table.HeaderCell>
                    </Table.Row>
                </Table.Header>

                <Table.Body>
                    {products.map(
                        (product:any) =>
                        <Table.Row key={product.id}>
                            <Table.Cell>{product.name}</Table.Cell>
                            <Table.Cell>{product.price}</Table.Cell>
                            <Table.Cell textAlign='center'>
                                {/* <UpdateProductForm product={product} updateData={this.props.updateData} requeryData={() => this.props.refreshList(this.props.curPageIndex)} /> */}
                            </Table.Cell>
                                <Table.Cell textAlign='center'>
                                    <DeleteButton 
                                        deleteData={() => deleteData(product.id)} 
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
        nameQry:state.ProductReducer.nameQry,
        priceQry:state.ProductReducer.priceQry,
        products:state.ProductReducer.products,
        totalData:state.ProductReducer.totalData,
        dataPerPage:state.ProductReducer.dataPerPage,
        curPageIndex:state.ProductReducer.curPageIndex,
        maxPageNumber:state.ProductReducer.maxPageNumber,
        curPageLink:state.ProductReducer.curPageLink,
        nextPageLink:state.ProductReducer.nextPageLink,
        prePageLink:state.ProductReducer.prePageLink,
        loading:state.ProductReducer.loading
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
            let action=updateProductQueryParameterAction(newValue);
            dispatch(action);
        },
        skipPage(curPageIndex:number){
            debugger;
            let newValue={
                curPageIndex
            }
            //first: update curPageIndex
            let action=updateProductQueryParameterAction(newValue);
            dispatch(action);
            
            //second: query customer
            action = queryProductAction(GetAccessToken());
            dispatch(action);
        },
        queryData(){
            console.log('query data from the database.');
            let action = queryProductAction(GetAccessToken());
            dispatch(action);
        },
        deleteData(productId:string){
            let action = deleteProductAction(productId,GetAccessToken());
            dispatch(action);
        }
    }
}

export default connect(stateToProps,dispatchToAction)(ListProduct);