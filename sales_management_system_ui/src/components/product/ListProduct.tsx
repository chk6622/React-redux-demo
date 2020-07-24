import React, {Component} from 'react';
import {connect} from 'react-redux';

class ListProduct extends Component{
    constructor(props:any){
        super(props);
    }

    componentDidMount(){
        console.log('load product data!');
    }

    render(){
        return (
            <>
                <div>
                    List Product Page.
                </div>
            </>
        );
    }
}

const stateToProps=(state:any)=>{
    return {

    }
}

const dispatchToAction=(dispatch:any)=>{
    return {

    }
}

export default connect(stateToProps,dispatchToAction)(ListProduct);