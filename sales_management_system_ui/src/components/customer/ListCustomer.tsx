import React,{Component} from 'react';
import { Menu, Confirm } from 'semantic-ui-react';
import {connect} from 'react-redux';

class ListCustomer extends Component{
    constructor(props:any){
        super(props);
    }

    componentDidMount(){
        console.log('Load Data');
    }

    render(){
        return (
            <>
            <div>
            ListCustomer Page
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

export default connect(stateToProps,dispatchToAction)(ListCustomer);
