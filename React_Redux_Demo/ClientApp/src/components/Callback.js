import React, { Component } from 'react'
import GetOidcHelper from '../helpers/OidcHelper';



class Callback extends Component {

    constructor(props) {
        super(props);
        this.oidcHelper=GetOidcHelper.getInstance();
    }

    callback() {
        /*let mgr = new Oidc.UserManager();
        mgr.signinRedirectCallback().then(user => {
            StoreUser(user);
            window.location = "/Home/Index";
        }).catch(function (e) {
            console.error(e);
        });*/

    }

    render() {
        this.oidcHelper.redirectCallback();
        return (
            <>

                

            </>
        )
    }
}

export default Callback