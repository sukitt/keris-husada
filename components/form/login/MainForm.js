import React, { Component, createRef } from 'react';
import { StyleSheet } from 'react-native';
import { Layout, Text, Icon } from '@ui-kitten/components';

import Kohana from '../animated/Kohana';

export default class MainFrom extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: ' ',
            password: ' ',
            show: false,
            colorUser: '',
            colorPass: '',
        }
        // Refs for managing clear input
        this.usernameRef = createRef();
        this.passwordRef = createRef();

        this.isFocus = this.isFocus.bind(this);
    }

    clear = () => {
        this.usernameRef.current.clear()
        this.passwordRef.current.clear()
    }

    isNotEmpty = (args) => args && args.length > 0;


    RenderIcon = (style) => (
        <Icon {...style} name={this.state.show? 'eye-outline': 'eye-off-2'} width={24} height={24} />
    );

    getValue = () => {
        return {
            username: this.state.username,
            password: this.state.password,
        }
    }

    isFocus = (args) => (
        args.isFocused()? 'lightskyblue': 'red'
    )

    render() {
        const colorUser = this.state.colorUser;
        const colorPass = this.state.colorPass;
        return (
            <>
            <Layout style={[styles.layoutUname, { borderColor: colorUser }]}>
                <Kohana 
                    textStyle={{ fontSize: 18 }}
                    labelText={'Nama pengguna'}
                    labelCategory={'s6'}
                    labelContainerStyle={{ paddingTop: 28, paddingLeft: 15 }}
                    labelStyle={{ color: '#a3a3a3', top: 5, left: 10 }}
                    iconName={'person-outline'}
                    iconColor={'#3366FF'}
                    iconSize={30}
                    iconContainerStyle={{ top: 7.5 }}
                    inputStyle={styles.unameField}
                    ref={this.usernameRef}
                    onChangeText={username => this.setState({username})}
                    autoFocus={true}
                    returnKeyType='next'
                    onSubmitEditing={() => this.passwordRef.current.focus()}
                    onFocus={() => this.setState({ colorUser: 'blue' })}
                    onBlur={() => this.setState({ colorUser: 'grey' })}
                    useNativeDriver
                    {...this.props}
                />
            </Layout>
            <Text category='label' style={{ marginLeft: 35, marginBottom: 10, color: 'red' }}>
                {this.isNotEmpty(this.state.username)? '': 'Nama pengguna tidak boleh kosong'}
            </Text>
            <Layout style={[styles.layoutPass, { borderColor: colorPass }]}>
                <Kohana
                    textStyle={{ fontSize: 18 }}
                    labelText={'Kata Sandi'}
                    labelCategory={'s6'}
                    labelContainerStyle={{ paddingTop: 28, paddingLeft: 15 }}
                    labelStyle={{ color: '#a3a3a3', top: 5, left: 10 }}
                    iconName={'lock-outline'}
                    iconColor={'#3366FF'}
                    iconSize={30}
                    iconContainerStyle={{ top: 7.5 }}
                    inputStyle={styles.pswdField}
                    secureTextEntry={!this.state.show}
                    ref={this.passwordRef}
                    onChangeText={password => this.setState({password})}
                    icon={this.RenderIcon}
                    onIconPress={() => this.setState(prevState => ({ show: !prevState.show }))}
                    onFocus={() => this.setState({ colorPass: 'blue' })}
                    onBlur={() => this.setState({ colorPass: 'grey' })}
                    useNativeDriver
                />
            </Layout>
            <Text category='label' style={{ marginLeft: 35, color: 'red' }}>
                {this.isNotEmpty(this.state.password)? '': 'Kata Sandi tidak boleh Kosong'}
            </Text>
            </>
        );
    };
};

const styles = StyleSheet.create({
    layoutUname: {
        // borderWidth:1 ,
        flex: 1,
        height: 20,
        backgroundColor: 'transparent',
        borderBottomWidth: 1,
    },
    unameField: { 
        // borderWidth: 1,
        marginTop: 15, 
        backgroundColor: 'transparent',
        borderColor: 'transparent',
        left: -10,
    },
    layoutPass: {
        // borderWidth: 1,
        flex: 1,
        height: 20,
        backgroundColor: 'transparent',
        borderBottomWidth: 1,
    },
    pswdField: {
        // borderWidth: 1,
        marginTop: 15, 
        backgroundColor: 'transparent',
        borderColor: 'transparent',
        left: -10,
    },
})
