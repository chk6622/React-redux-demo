import React, {Component} from 'react';
import { connect } from 'react-redux';


class ListSale extends Component{
    constructor(props:any){
        super(props);
    }

    componentDidMount(){
        console.log('Load sales data');
    }

    render(){
        return (
            <>
                <div>
                    List Sales Page.
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

export default connect(stateToProps,dispatchToAction)(ListSale);