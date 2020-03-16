import React, { Component } from 'react';
import { Layout, Text, Icon, Input, Button } from '@ui-kitten/components';
import { View, StyleSheet, Dimensions, Alert } from 'react-native';
import { axiosBase } from '../constants/Endpoint';

class VerificationScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            value: '',
        }

        this.onChangeText = this.onChangeText.bind(this);
        this.handleVerify = this.handleVerify.bind(this);
    }

    onChangeText = (text) => {
        this.setState({
            value: text,
        });
    }

    handleVerify = () => {
        const { params } = this.props.navigation.state;
        const isNotEmpty = this.state.value && this.state.value.length === 6;
        console.log(params)
        if (isNotEmpty) {

            const data = { 
                phone_number: params? params.number : '-none-',
                session_token: params? params.session.session_token : '-none-',
                security_code: this.state.value,
            }
            axiosBase.post('phone_verify/phone/verify', data)
            .then((response) => {
                if (response.status === 200) {
                    Alert.alert(
                        'Info',
                        response.data.message,
                        [{text: 'Ok', onPress: () => console.log('pressed')}],
                    )

                }
                alert(response.data);
                console.log(response);
            })
            .catch((err) => {
                if (err) {
                    console.log(err.response)
                }
            })
        } else {
            alert('Masukan verifikasi kode');
        }
    }
    render() {
        return (
            <Layout style={{ padding: 20 }}>
                <Text category='h6'></Text>
                <Input
                    textStyle={{
                        textAlign: 'center',
                        fontSize: 30,
                    }}
                    value={this.state.value}
                    onChangeText={this.onChangeText}
                    keyboardType='numeric'
                    placeholder='_ _ _ _ _ _'
                    maxLength={6}
                    size='large'
                />
                <Button onPress={this.handleVerify}>
                    Verifikasi kode konfirmasi
                </Button>
            </Layout>
        );
    };
};

export default VerificationScreen;

const style = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
    }
})