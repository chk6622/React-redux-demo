import React, { Component } from 'react'
import { Menu, Confirm } from 'semantic-ui-react'
import 'semantic-ui-css/semantic.min.css';
import { Link } from 'react-router-dom';
import GetOidcHelper from '../helpers/OidcHelper';
import {connect} from 'react-redux';
import {IAppMenuState} from '../redux/IState';
import {IAppMenuProps} from '../redux/IProps';
import {ChangeActiveItemAction,ChangeOpenStateAction} from '../redux/Actions';


class AppMenu extends Component<IAppMenuProps,IAppMenuState> {
    constructor(props:IAppMenuProps){
        super(props);
    }

    render() {
        const { activeItem,isOpen,handleItemClick,openConfirm,closeConfirm,confirmAndDo} = this.props
        //debugger;
        return (
          <>
                <Menu vertical tabular fluid>
                <Menu.Item as={Link} to="index"
                    icon='home'
                    name='Home'
                    active={activeItem === 'Home'}
                    onClick={()=>{handleItemClick('Home')}}
                />

                <Menu.Item as={Link} to="customer"
                    icon='user' 
                    name='Customer'
                    active={activeItem === 'Customer'}
                    onClick={()=>{handleItemClick('Customer')}}
                />

                <Menu.Item as={Link} to="product"
                    icon='archive'
                    name='Product'
                    active={activeItem === 'Product'}
                    onClick={()=>{handleItemClick('Product')}}
                />

                <Menu.Item as={Link} to="store"
                    icon ='building outline'
                    name='Store'
                    active={activeItem === 'Store'}
                    onClick={()=>{handleItemClick('Store')}}
                    />
                    
                <Menu.Item as={Link} to="sales"
                    icon='dollar sign' 
                    name='Sales'
                    active={activeItem === 'Sales'}
                    onClick={()=>{handleItemClick('Sales')}}
                    />
                <Menu.Item as={Link}
                    icon='sign out'
                    name='Exits'
                    active={activeItem === 'Exits'}
                    onClick={openConfirm}
                />
            </Menu >
            <Confirm
                open={isOpen}
                header='Log out.'
                onCancel={closeConfirm}
                onConfirm={confirmAndDo}
            />
          </>
        )
    }
}

const stateToProps=(state:IAppMenuState)=>{
    return {
        isOpen:state.isOpen,
        activeItem:state.activeItem
    } 
}

const dispatchToAction=(dispatch:any)=>{
    return {
        handleItemClick(name:string){
            const action=ChangeActiveItemAction(name);
            dispatch(action);
        },
        confirmAndDo(){
            //this.setState({ isOpen: false });
            const action=ChangeOpenStateAction(false);
            dispatch(action);
            var oidcHelper = GetOidcHelper.getInstance();
            oidcHelper.logout();
        },
        closeConfirm(){
            const action=ChangeOpenStateAction(false);
            dispatch(action);
        },
        openConfirm(){
            const action=ChangeOpenStateAction(true);
            dispatch(action);
        }
    }
}

export default connect(stateToProps,dispatchToAction)(AppMenu);