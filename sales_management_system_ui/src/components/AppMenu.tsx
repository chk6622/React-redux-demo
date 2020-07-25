import React, { Component } from 'react';
import { Menu, Confirm } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import GetOidcHelper from '../helpers/OidcHelper';
import {connect} from 'react-redux';
import {IAppMenuState} from '../redux/IState';
import {IAppMenuProps} from '../redux/IProps';
import {ChangeActiveItemAction,ChangeOpenStateAction} from '../redux/MenuActions';


const AppMenu = (props:IAppMenuProps) => {

    const { activeItem,isOpen,handleItemClick,openConfirm,closeConfirm,confirmAndDo} = props;
    //debugger
    return (
          <>
                <Menu vertical tabular fluid>
                <Menu.Item as={Link} to="Welcome"
                    icon='home'
                    name='Home'
                    active={activeItem === 'Home'}
                    onClick={()=>{handleItemClick('Home')}}
                />

                <Menu.Item as={Link} to="Customer"
                    icon='user' 
                    name='Customer'
                    active={activeItem === 'Customer'}
                    onClick={()=>{handleItemClick('Customer')}}
                />

                <Menu.Item as={Link} to="Product"
                    icon='archive'
                    name='Product'
                    active={activeItem === 'Product'}
                    onClick={()=>{handleItemClick('Product')}}
                />

                <Menu.Item as={Link} to="Store"
                    icon ='building outline'
                    name='Store'
                    active={activeItem === 'Store'}
                    onClick={()=>{handleItemClick('Store')}}
                    />
                    
                <Menu.Item as={Link} to="Sales"
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

const stateToProps=(state:any)=>{
    return {
        isOpen:state.AppMenuReducer.isOpen,
        activeItem:state.AppMenuReducer.activeItem
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
            //debugger
            const action=ChangeOpenStateAction(true);
            dispatch(action);
        }
    }
}

export default connect(stateToProps,dispatchToAction)(AppMenu);