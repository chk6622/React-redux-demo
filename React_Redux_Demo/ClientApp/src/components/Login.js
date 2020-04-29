import React, { Component } from 'react'
import { Segment, Menu, Confirm } from 'semantic-ui-react'
import 'semantic-ui-css/semantic.min.css';
import { Link, withRouter } from 'react-router-dom';
import Oidc from 'oidc-client';

let mgr = new Oidc.UserManager();
mgr.signinRedirectCallback().then(function () {
    mgr.getUser().then(user => {
        sessionStorage.setItem('user', JSON.stringify(user));
        let u = JSON.parse(sessionStorage.getItem('user'));
        console.log(u);
        console.log(u['access_token']);
        //window.alert('aaa');
    });
    
    window.location = "/Home/Index";
}).catch(function (e) {
    console.error(e);
});

class Login extends Component {

    constructor(props) {
        super(props);
        var config = {
            authority: "http://localhost:5000",
            client_id: "react-client",
            redirect_uri: "http://localhost:3000",
            response_type: "id_token token",
            scope: "openid profile api1 roles",
            post_logout_redirect_uri: "http://localhost:3000",
        };
        var mgr = new Oidc.UserManager(config);
        
        this.state = {
           
            mgr
        };
        this.log = this.log.bind(this);
        this.logout = this.logout.bind(this);
        this.api = this.api.bind(this);
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

    logout()
    {
        var mgr = this.state['mgr'];
        if (mgr) {
            mgr.signoutRedirect();
        }
        
    }

    api() {
        this.mgr.getUser().then(function (user) {
            var url = "http://localhost:5001/identity";

            var xhr = new XMLHttpRequest();
            xhr.open("GET", url);
            xhr.onload = function () {
                this.log(xhr.status, JSON.parse(xhr.responseText));
            }
            xhr.setRequestHeader("Authorization", "Bearer " + user.access_token);
            xhr.send();
        });
    }

    login() {
        var mgr = this.state['mgr'];
        var user = null;
        mgr.getUser().then(function (u) {
            user = u;
        });
        if (user) {
            console.log("User logged in", user.profile);
            window.location = "/Home/Index";


        }
        else {
            console.log("User not logged in");
            mgr.signinRedirect().then(function () {
                console.log('aaa');
                //console.log(mgr.access_token);
                //window.alert('bbb');
                //window.location = "/Home/Index";
            });
            
            /*mgr.signinRedirectCallback().then(function () {
                //that.setState({ 'user': user });
                 window.location = "/Home/Index";
            }).catch(function (e) {
                console.error(e);
            });*/
            
        }
        
    }

    render() {
        var user = this.state['user'];
        if (user) {
            // var user = mgr.getUser();
            console.log(user);
            window.location = "/Home/Index";
        }
        else {
            var mgr = this.state['mgr'];
            if (mgr) {
                mgr.getUser().then(function (u) {
                    user = u;
                });
                if (user) {
                    console.log(user);
                    this.setState({ 'user': user });
                }
                
            }
        }
        
        return (
          <>
                This is login page!
                <pre id="results"></pre>
                <button id="login" onClick={this.login}> Login</button >
                <button id="api">Call API</button>
                <button id="logout" onClick={this.logout}>Logout</button>
          </>
        )
    }
}

export default Login