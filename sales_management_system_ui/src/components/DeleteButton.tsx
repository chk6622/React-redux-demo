import React, { Component } from 'react'
import { Button, Confirm } from 'semantic-ui-react'


const confirmStyle:any = { position: 'relative', height: '200px' }

interface IDeleteButtonProps{
    deleteData:any;
}
interface IDeleteButtonState{
    isOpen:any;
}

class DeleteButton extends Component<IDeleteButtonProps,IDeleteButtonState> {
    constructor(props:IDeleteButtonProps) {
        super(props);
        this.state = { isOpen: false }
        //this.deleteData = this.deleteData.bind(this);
        this.show = this.show.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
        this.handleConfirm = this.handleConfirm.bind(this);
    }

    // deleteData() {
    //     this.props.deleteData();
    // }
    

    show = () => this.setState({ isOpen: true })

    handleConfirm = () => {
        // console.log('Begin delete data');
        this.props.deleteData();
        this.setState({ isOpen: false });
    }

    handleCancel = () => {
        //this.props.Callback();
        this.setState({ isOpen: false });
    }

    render() {
        return (
            <div>
                <Button color='red' onClick={this.show}>Delete</Button>
                <Confirm 
                    style={confirmStyle}
                    open={this.state.isOpen}
                    header='This data will be deleted!'
                    onCancel={this.handleCancel}
                    onConfirm={this.handleConfirm}
                />
            </div>
        )
    }
}

export default DeleteButton