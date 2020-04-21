import faker from 'faker'
import _ from 'lodash'
import React, { Component } from 'react'
import { Dropdown } from 'semantic-ui-react'



export default class DropdownSearchQuery extends Component {
    constructor(props) {
        super(props);
        /*let url = '/customer/query';
        let optionTextPropsName = 'name';
        let optionValuePropsName = 'id';
        let returnPropsName = 'customerId';
        */
        this.state = { 'searchQuery': '', 'value': this.props.initValue, };// 'optionTextPropsName': optionTextPropsName, 'optionValuePropsName': optionValuePropsName, 'returnPropsName': returnPropsName, };
        this.requireRemoteData = this.requireRemoteData.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleSearchChange = this.handleSearchChange.bind(this);
        //this.requireRemoteData(this.props.fetchDataUrl);
    }

    componentWillMount() {
        this.requireRemoteData();
    }

    requireRemoteData() {
        let url = this.props.fetchDataUrl;
            fetch(url)
                .then(response => response.json())
                .then(data => {
                    if (data != null) {
                        let options = data.results.map(item => {
                            if (item.id == this.props.initValue) {  //init searchQuery
                                this.setState({ 'searchQuery': item.name });
                            }
                            return ({
                                key: item[this.props.optionValuePropsName],
                                text: item[this.props.optionTextPropsName],
                                value: item[this.props.optionValuePropsName],
                            });
                            
                        }
                        );
                        this.setState({ "options": options });
                    }
                });
    }


    handleChange = (e, { searchQuery, value }) => {
        let rName = this.props.returnPropsName;
        //this.props.parent.setState({ [rName]: value, });
        this.props.myChangeHandler({ [rName]: value });
        console.log({ searchQuery, value });
        this.setState({ searchQuery, value });
    }
       

    handleSearchChange = (e, { searchQuery }) => {
        console.log(searchQuery);
        this.setState({ searchQuery })
    }

    render() {
        //const { searchQuery, value } = this.state;
        
        return (
            <Dropdown
                
                clearable
                onChange={this.handleChange}
                //onClick={this.handleChange}
                onSearchChange={this.handleSearchChange}
                options={this.state.options}
                placeholder={this.props.placeholder}
                search
                //searchQuery={this.state.searchQuery}
                selection
                value={this.state.value}
            />
        )
    }
}
