import React, { Component } from 'react'
import { Button, Confirm } from 'semantic-ui-react'


const confirmStyle = { position: 'relative', height: '200px' }
/*
 * DeleteUrl:
 * Callback:
 */
class DeleteButton extends Component {
    constructor(props) {
        super(props);
        this.state = { isOpen: false }
        this.deleteData = this.deleteData.bind(this);
        this.show = this.show.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
        this.handleConfirm = this.handleConfirm.bind(this);
    }

    deleteData() {
        /*fetch(this.props.DeleteUrl)
            .then(function (response) {
                return response.json();
            })
            .then(function (myJson) {
                setTimeout(alert(myJson.message), 800);
            })
            .then(
                setTimeout(this.props.Callback(), 1200)
            );*/
        this.props.deleteData();
    }
    

    show = () => this.setState({ isOpen: true })

    handleConfirm = () => {
        console.log('Begin delete data');
        this.props.deleteData();
        this.setState({ isOpen: false });
        console.log('Data has been deleted');
        console.log('Begin query data');
        //this.props.requeryData();
        //debugger
        //this.props.requeryData();
        console.log('Query data finished');
    }

    handleCancel = () => {
        //this.props.Callback();
        this.setState({ isOpen: false });
    }

    render() {
        return (
            <div>
                <Button color='red' onClick={this.show}>Delete</Button>
                <Confirm style={confirmStyle}
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