import React, { Component } from 'react'
import GetOidcHelper from '../helpers/OidcHelper';



class Callback extends Component {

    private oidcHelper:any=null;

    constructor(props:any) {
        super(props);
        this.oidcHelper=GetOidcHelper.getInstance();
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