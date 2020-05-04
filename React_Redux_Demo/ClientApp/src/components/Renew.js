import React, { Component } from 'react'
import { Link, withRouter } from 'react-router-dom';
import Oidc from 'oidc-client';
import { environment } from '../environments/environment';
import { StoreUser, GetUser } from '../helpers/UserHelper';
import '../css/AppLogin.css';
import GetOidcHelper from '../helpers/OidcHelper';



class Renew extends Component {

    constructor(props) {
        super(props);
        this.oidcHelper = GetOidcHelper.getInstance();
    }

    /*renew() {
        new Oidc.UserManager().signinSilentCallback().then(user => {
            StoreUser(user);
        });
    }*/

    render() {
        this.oidcHelper.renew();
        return (
            <>

                

            </>
        )
    }
}

export default Renew