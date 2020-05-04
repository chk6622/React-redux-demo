import React, { Component } from 'react'
import { Segment, Menu, Confirm } from 'semantic-ui-react'
import 'semantic-ui-css/semantic.min.css';
import { Link, withRouter } from 'react-router-dom';
import Oidc from 'oidc-client';
import { environment } from '../environments/environment';
import {Button} from "semantic-ui-react";
import { StoreUser, GetUser } from '../helpers/UserHelper';
import GetOidcHelper from '../helpers/OidcHelper';
import '../css/AppLogin.css';


/*let mgr = new Oidc.UserManager();
mgr.signinRedirectCallback().then(user => {
    StoreUser(user);
    window.location = "/Home/Index";
}).catch(function (e) {
    console.error(e);
});*/

class Login extends Component {

    constructor(props) {
        super(props);

        this.oidcHelper = GetOidcHelper.getInstance();
        
        this.state = {
        };
       // this.log = this.log.bind(this);
        //this.login = this.login.bind(this);

        
    }

    /*log() {
        document.getElementById('results').innerText = '';

        Array.prototype.forEach.call(arguments, function (msg) {
            if (msg instanceof Error) {
                msg = "Error: " + msg.message;
            }
            else if (typeof msg !== 'string') {
                msg = JSON.stringify(msg, null, 2);
            }
            document.getElementById('results').innerHTML += msg + '\r\n';
        });
    }

    login() {
        let user = GetUser();//sessionStorage.getItem('user');
        if (!user) {
            var mgr = new Oidc.UserManager(environment.openIdConnectSettings);
            if (mgr) {
                mgr.signinRedirect();
            }
        }
        else {
            window.location = "/Home/Index";
        }
    }*/

    render() {

        return (
          <>

                <div className="wrap" id="wrap">
                    <div className="logGet">

                        <div className="logD logDtip">
                            <p className="p1">Sales Management System</p>
                        </div>
                        
                            <div className="lgNotice">
                                <div asp-validation-summary="All" className="text-danger">
                                    <pre id="results"></pre>
                                </div>
                            </div>
                            <div className="logC">
                               

                            <Button primary as='a' size='huge' onClick={()=>this.oidcHelper.login()}>Login</Button>
                            
                            </div>
                     
            </div>
                </div>

          </>
        )
    }
}

export default Login