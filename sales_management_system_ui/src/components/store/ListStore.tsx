import React, {Component} from 'react';
import { connect } from 'react-redux';


class ListStore extends Component{
    constructor(props:any){
        super(props);
    }

    componentDidMount(){
        console.log('load store data');
    }

    render(){
        return (
            <>
                <div>
                    List Store Page!
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

export default connect(stateToProps,dispatchToAction)(ListStore);