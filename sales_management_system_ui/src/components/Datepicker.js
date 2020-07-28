import React from 'react'
import PropTypes from 'prop-types';
import parse from 'date-fns/parse';
import SemanticDatepicker from 'react-semantic-ui-datepickers';
import 'react-semantic-ui-datepickers/dist/react-semantic-ui-datepickers.css';


const Datepicker = (props) => {

    // const propTypes = {
    //     name: PropTypes.string,
    //     initDate: PropTypes.string,
    //     handleChangeHandler: PropTypes.func,
    // }

    const onChange = (event, data) => {
        let name = props.name;
        let handleChangeHandler = props.handleChangeHandler;
        if (data.value != null) {
            let year = data.value.getFullYear();
            let month = data.value.getMonth() + 1;
            let dateOfMonth = data.value.getDate();
            let chosenDate = year + '-' + (month < 10 ? '0' + month : month) + '-' + (dateOfMonth < 10 ? '0' + dateOfMonth : dateOfMonth);
            if (name != null && handleChangeHandler != null) {
                handleChangeHandler( name, chosenDate );
            }
        }
        else {
            handleChangeHandler(name, null );
        }
    };


    return <SemanticDatepicker
        onChange={onChange}
        placeholder='Please pick a date.'
        datePickerOnly='true'
        clearable='true'
        value={props.initDate == null ? '' : parse(props.initDate,'yyyy-MM-dd',new Date())}
    />;
};

export default Datepicker;