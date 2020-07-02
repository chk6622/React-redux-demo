import React, { Component } from 'react'
import GetOidcHelper from '../helpers/OidcHelper';



class Renew extends Component {

    constructor(props) {
        super(props);
        this.oidcHelper = GetOidcHelper.getInstance();
    }

    render() {
        this.oidcHelper.renew();
        return (
            <>

                

            </>
        )
    }
}

export default Renew