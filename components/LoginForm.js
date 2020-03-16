import React, { Component } from 'react';
import { View } from 'react-native';
import { Button } from '@ui-kitten/components';
import t from 'tcomb-form-native'; // ^0.6.20

const Form = t.form.Form;

const Auth = t.struct({
    username: t.String,
    password: t.String,
})

class LoginForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            value: null
        }
        this.onChange = this.onChange.bind(this);
        this.clearForm = this.clearForm.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }

    onChange = (value) => this.setState({ value });

    clearForm = () => this.setState({ value: null });

    onSubmit = () => {
        const valueField = this.refs.form.getValue();
        if (valueField) {
            console.log(value);
            this.clearForm();
        };
    };

    render() {

        return(
            <View>
                <Form
                    {...this.props}
                    ref='form'
                    type={Auth}
                    value={this.state.value}
                    onChange={this.onChange}
                />
                <Button onPress={this.onSubmit}>
                    Save
                </Button>
            </View>
        );
    };
};

export default LoginForm;