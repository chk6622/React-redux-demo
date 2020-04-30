import React, { Component } from 'react'
import { Segment, Menu, Confirm } from 'semantic-ui-react'
import 'semantic-ui-css/semantic.min.css';
import { Link, withRouter } from 'react-router-dom';
import Oidc from 'oidc-client';
import { environment } from '../environments/environment';
import {Button} from "semantic-ui-react";
import { StoreUser, GetUser } from '../helpers/UserHelper';
import '../css/AppLogin.css';
//import '../css/bootstrap.min.css';

let mgr = new Oidc.UserManager();
mgr.signinRedirectCallback().then(function () {
    mgr.getUser().then(user => {
        StoreUser(user);
        //sessionStorage.setItem('user', JSON.stringify(user));
        //let u = JSON.parse(sessionStorage.getItem('user'));
        //console.log(u);
        //console.log(u['access_token']);
        //window.alert('aaa');
    });
    
    window.location = "/Home/Index";
}).catch(function (e) {
    console.error(e);
});

class Login extends Component {

    constructor(props) {
        super(props);

        
        
        this.state = {
           
            mgr
        };
        this.log = this.log.bind(this);
        this.login = this.login.bind(this);

        
    }

    log() {
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
    }

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
                               

                            <Button primary as='a' size='huge' onClick={this.login}>Login</Button>
                            
                            </div>
                     
            </div>
                </div>

          </>
        )
    }
}

export default Login