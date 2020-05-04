import React, { Component } from 'react'
import { Segment, Menu, Confirm } from 'semantic-ui-react'
import 'semantic-ui-css/semantic.min.css';
import { Link, withRouter } from 'react-router-dom';
import { environment } from '../environments/environment';
import Oidc from 'oidc-client';
import { GetUser } from '../helpers/UserHelper';
import GetOidcHelper from '../helpers/OidcHelper';

const menuHeader = {
    height: '35px',
    font: '20px bold',
    border: 'solid black',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
}
const menuItem = {
    height: '30px',
    font: '15px bold',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
}

function logout() {
    let user = GetUser();
    if (user) {
        let mgr = new Oidc.UserManager(environment.openIdConnectSettings);
        if (mgr) {
            mgr.signoutRedirect().then(res => {
                sessionStorage.clear();
            });
        }
    }
    else {
        window.location = '/';
    }
}

export class AppMenu extends Component {
    state = { activeItem:'Home',isOpen:false }

    handleItemClick = (e, { name }) => {
        this.setState({ activeItem: name });
    }

    confirmAndDo = () => {
        this.setState({ isOpen: false });
        var oidcHelper = GetOidcHelper.getInstance();
        oidcHelper.logout();
        //logout();
    }

    closeConfirm = () => {
        this.setState({ isOpen: false });
    }

    openConfirm = () => {
        this.setState({ isOpen: true });
    }


    render() {
        const { activeItem } = this.state
        //debugger;
        return (
          <>
                <Menu vertical tabular fluid>
                <Menu.Item as={Link} to="index"
                    icon='home'
                    name='Home'
                    active={activeItem === 'Home'}
                    onClick={this.handleItemClick}
                />

                <Menu.Item as={Link} to="customer"
                    icon='user' 
                name='Customer'
                active={activeItem === 'Customer'}
                onClick={this.handleItemClick}
                />

                <Menu.Item as={Link} to="product"
                    icon='archive'
                    name='Product'
                    active={activeItem === 'Product'}
                    onClick={this.handleItemClick}
                    />

                <Menu.Item as={Link} to="store"
                    icon ='building outline'
                    name='Store'
                    active={activeItem === 'Store'}
                    onClick={this.handleItemClick}
                    />
                    
                <Menu.Item as={Link} to="sales"
                    icon='dollar sign' 
                    name='Sales'
                    active={activeItem === 'Sales'}
                    onClick={this.handleItemClick}
                    />
                <Menu.Item as={Link}
                    icon='sign out'
                        name='Exits'
                        active={activeItem === 'Exits'}
                    link='www.google.com'
                    onClick={this.openConfirm}
                />
            </Menu >
            <Confirm
                    open={this.state.isOpen}
                header='Log out.'
                onCancel={this.closeConfirm}
                onConfirm={this.confirmAndDo}
                />
          </>
        )
    }
}

