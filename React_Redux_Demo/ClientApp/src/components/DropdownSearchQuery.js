﻿import faker from 'faker'
import _ from 'lodash'
import React, { Component } from 'react'
import { Dropdown } from 'semantic-ui-react'
import { GetUser, GetAccessToken } from '../helpers/UserHelper';
import { environment } from '../environments/environment';
import { Es7FetchData } from '../Es7FetchLab';



export default class DropdownSearchQuery extends Component {
    constructor(props) {
        super(props);
        /*let url = '/customer/query';
        let optionTextPropsName = 'name';
        let optionValuePropsName = 'id';
        let returnPropsName = 'customerId';
        */
        console.log(this.props.initOptions);
        this.state =
        {
            'searchQuery': '',
            'value': this.props.initValue,
            'options': this.props.initOptions != null && this.props.initOptions != undefined?
                this.props.initOptions.map(item => {
                    return {
                        key: item[this.props.optionValuePropsName],
                        text: item[this.props.optionTextPropsName],
                        value: item[this.props.optionValuePropsName],
                    }     
                }):''
            
        };// 'optionTextPropsName': optionTextPropsName, 'optionValuePropsName': optionValuePropsName, 'returnPropsName': returnPropsName, };
        this.requireRemoteData = this.requireRemoteData.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleSearchChange = this.handleSearchChange.bind(this);
        //this.requireRemoteData(this.props.fetchDataUrl);
    }

    componentWillMount() {
        //this.requireRemoteData();
    }

    requireRemoteData(searchQuery) {
        var httpHelper = new Es7FetchData();
        let apiUrl = environment.apiBase;
        //let queryParam = searchQuery;
        let queryParam = '';
        if (searchQuery != null && searchQuery != '') {
            queryParam = `?${this.props.queryPropsName}=${searchQuery}`;
        }
        /*else if (this.props.initValue != null && this.props.initValue!=''){
            queryParam = `?${this.props.initQueryPropName}=${this.props.initValue}`;
        }*/
        let url = `${apiUrl}${this.props.fetchDataUrl}${queryParam}`;
        console.log(`execute query ${url}`);
        httpHelper.get(url, GetAccessToken())
            .then((data) => {
                //debugger
                let body = data['body'];
                if (body) {
                    let options = body.value.map(item => {
                        /*if (item.id == this.props.initValue) {  //init searchQuery
                            this.setState({ 'searchQuery': item.name });
                        }*/
                        return ({
                            key: item[this.props.optionValuePropsName],
                            text: item[this.props.optionTextPropsName],
                            value: item[this.props.optionValuePropsName],
                        });

                    });
                    this.setState({ "options": options });
                }
                
                
            })
        /*
        let url = this.props.fetchDataUrl;
            fetch(url)
                .then(response => response.json())
                .then(data => {
                    alert(data);
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
                });*/
    }


    handleChange = (e, { searchQuery, value }) => {
        console.log('onChange:handleChange');
        let rName = this.props.returnPropsName;
        //this.props.parent.setState({ [rName]: value, });
        this.props.myChangeHandler({ [rName]: value });
        console.log(`========================${ searchQuery, value }`);
        this.setState({ searchQuery, value });
    }
       

    handleSearchChange = (e, { searchQuery }) => {
        console.log('onSearchChange:handleSearchChange');
        console.log(searchQuery);
        this.requireRemoteData(searchQuery);
        //this.setState({ searchQuery })
    }

    render() {
        //const { searchQuery, value } = this.state;
        console.log(this.state.options);
        return (
            <Dropdown
                
                clearable
                onChange={this.handleChange}
                onFocus={this.handleSearchChange}
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
