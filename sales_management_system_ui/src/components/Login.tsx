import React, { Component } from 'react';
import { Button, Segment, Menu, Confirm } from 'semantic-ui-react';
import 'semantic-ui-css/semantic.min.css';
import '../css/AppLogin.css';
import OidcHelper from '../helpers/OidcHelper';




class Login extends Component {

    private oidcHelper:any=null;

    constructor(props:any) {
        super(props);

        this.oidcHelper = OidcHelper.getInstance();
        
        this.state = {
        }; 
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
                               

                            <Button primary as='a' size='huge' onClick={()=>this.oidcHelper.login()}>Login</Button> 
                            
                            </div>
                     
            </div>
                </div>

          </>
        )
    }
}

export default Login