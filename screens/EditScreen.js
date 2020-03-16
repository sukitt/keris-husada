import React, { Component, createContext, createRef, useContext } from 'react';
import { 
    View, 
    StyleSheet, 
    TouchableOpacity, 
    TextInput, 
    Alert, 
    Dimensions, 
    ActivityIndicator 
} from 'react-native';
import { connect } from 'react-redux';
import { Layout, Text, Button, Icon, Input } from '@ui-kitten/components';
import Sae from '../components/form/animated/Sae';
import PhoneInput from '../components/form/phone';
import { EvilIcons } from '@expo/vector-icons';
import { BaseURL, axiosBase } from '../constants/Endpoint';

import CustomHeader from '../components/CustomHeader';
import { verifyPhone, updateUser, setAccount } from '../redux/actions';
import { ThemeContext } from '../constants/theme-context';
import ValidationComponent from 'react-native-form-validator';

const mapStateToProps = (state) => {
    return {
        id: state.auth.id,
        token: state.auth.token,
        token_refresh: state.auth.token_refresh,
        account: state.auth.account,
        received_token: state.auth.received_token,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        setAccount: (args) => (
            dispatch(setAccount(args))
        ),
    }
}

class connectEditScreen extends ValidationComponent {
    static contextType = ThemeContext;
    static navigationOptions = ({ navigation, screenProps }) => {
        let label = navigation.getParam('label', 'none')
        return {
            // title: params? (params.label.includes('telepon')? 'Nomor baru': params.label): '-none',
            title: label.includes('telepon')? 'Nomor baru': label
        }
    }
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            init: '',
            value: '',
            label: null,
            disabled: true,
            is_exist: false,
            typing: false,
            typingTimeout: 0,
            statusField: 'basic'
        }

        this.onChange = this.onChange.bind(this);
        this.update = this.update.bind(this);
        this.handlePhone = this.handlePhone.bind(this);
    }

    componentDidMount() {
        const { params } = this.props.navigation.state;
        const value = params.value && params.value || ' ';
        const label = params.label && params.label.toLowerCase() || ' ';

        this.setState({
            init: value,
            value: value,
            label: label,
            isLoading: false,
        })
        console.log(label);
    }

    toggleTyping = () => (
        this.setState(prev => ({
            typing: !prev.typing
        }))
    );

    validateEmailInput() {
        // const format = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        // return format.test(mail)
        this.validate({value: {email: true}})
    }

    update = () => {
        if (this.state.label === 'alamat email') {
            if (this.validateEmailInput(this.state.value)) {
                if (this.state.is_exist) {
                    return alert('Maaf, alamat email sudah digunakan, silahkan ganti dengan yang lain.')
                } else {
                    return updateUser(
                        this.props.id, 
                        this.state.value, 
                        this.props.token, 
                        this.state.label
                    )
                    .then(response => {
                        console.log('==========Label=============');
                        console.log(this.state.label);
            
                        console.log('==========Response data=============');
                        console.log(response.data);
                        console.log('==========Set Account Redux=============');
                        console.log(this.props.setAccount(response.data));
                        console.log('=======================');
                        this.props.navigation.goBack();
                        alert(JSON.stringify(response.data))
                    })
                    .catch(err => {
                        console.log(err)
                        alert(JSON.stringify(err.response))
                    })
                }
            } else {
                return (
                    this.setState({statusField: 'danger'}),
                    alert('Silahkan masukan alamat email yang benar.')
                )
            }
        } else {
            if (this.state.is_exist) {
                return null;
            } else {
                return updateUser(
                    this.props.id, 
                    this.state.value, 
                    this.props.token, 
                    this.state.label
                )
                .then(response => {
                    console.log('==========Label=============');
                    console.log(this.state.label);
        
                    console.log('==========Response data=============');
                    console.log(response.data);
                    console.log('==========Set Account Redux=============');
                    console.log(this.props.setAccount(response.data));
                    console.log('=======================');
                    this.props.navigation.goBack();
                    alert(JSON.stringify(response.data))
                })
                .catch(err => {
                    console.log(err)
                    alert(err.response)
                })
            }
        }
    }

    validate = () => {
        let text = this.state.value;
        const { label } = this.state;
        let endpoint;
        let data = {};
        switch (label) {
            case 'username':
                endpoint = label;
                data = { username: text }
                break;
        
            case 'password':
                endpoint = label;
                data = { password: text }
                break;

            case 'alamat email':
                endpoint = 'email';
                data = { email: text }
                break;
                
            case 'tap untuk mengganti nomor telepon':
                endpoint = 'phone_number';
                data = { phone_number: text }
                break;

            default:
                break;
        }

        axiosBase.get(`validate_${endpoint}`, {params: data})
        .then((res) => {
            this.setState({ 
                is_exist: res.data.is_exist,
                typing: false,
                statusField: res.data.is_exist? 'danger': 'success'
            });
        })
        .catch((err) => {
            console.log(err.response.status);
            this.setState({ statusField: 'danger' })
            this.toggleTyping();
        });
    }

    onChange = (text) => {
        const { typingTimeout, init, label } = this.state
        const textEvent = text && text;
        const isNotEmptyAndGte4 = textEvent && textEvent.length > 4;
        const setFalse = () => this.setState({typing:false});
        const setTrue = () => this.setState({typing:true});

        if (typingTimeout) {
            clearTimeout(typingTimeout);
            setTrue()
        };
        
        this.setState({
            value: textEvent,
            typingTimeout: setTimeout(() => {
                label !== 'alamat email'
                ? isNotEmptyAndGte4 
                    ? textEvent === init
                        ? setFalse()
                        : this.validate(textEvent)
                    : setFalse()
                : this.validateEmailInput()
                    ? textEvent === init
                        ? setFalse()
                        : setFalse()
                    : setFalse()
            }, 2000)
        });
    }

    setMessage = () => {
        const { value, label, init, is_exist, typing } = this.state;
        const isNotEmptyAndGte4 = value && value.length > 4;
        let msg_requiremet;
        let message;
        let reject;
        console.log(label);
        switch (label) {
            case 'username':
                message = 'Mengecek nama pengguna...';
                reject = 'Maaf, nama pengguna tersebut sudah ada';
                msg_requiremet = 'Nama pengguna setidaknya memiliki 5 karakter';
                break;
            case 'password':
                message = 'Mengecek kata sandi';
                msg_requiremet = 'Nama pengguna setidaknya memiliki 5 karakter';
                reject = 'Maaf, silahkan ganti kata sandi';
                break
            case 'alamat email':
                message = 'Mengecek alamat email';
                msg_requiremet = 'Silahkan masukan alamat email yang benar';
                reject = 'Maaf, alamat email tersebut sudah ada, silahkan ganti alamat email yang lain.';
                break
            default:
                break;
        }

        if (label !== 'alamat email') {
            if (isNotEmptyAndGte4) {
                if (typing) {
                    return message;
                } else {
                    if (value === init) {
                        return `${value} dapat digunakan`;
                    } else {
                        if (is_exist) {
                            return reject;
                        } 
                        return `${value} dapat digunakan`;
                    }
                }
            } else {
                return msg_requiremet;
            }

        } else if (label === 'tap untuk mengganti nomor telepon') {

        } else {
            if (this.validateEmailInput(value)) {
                if (is_exist) {
                    return reject;
                } else {
                    return `${value} valid dan dapat digunakan`;
                }
            } else {
                return msg_requiremet;
            }
        }
        
    }

    handlePhone = () => {
        const phone = this.phone.getValue();
        const isValid = this.phone.isValidNumber();
        const isGt10 = phone && phone.length > 10;
        let title, message;
        if (isValid && isGt10) {
            title = 'Konfirmasi';
            message = `Nomor: ${phone} tersebut benar?`;
            const data = { phone_number: phone}
            Alert.alert(
                title,
                message,
                [{text: 'OK', onPress: () => {
                    axiosBase.post('phone_verify/phone/register', data)
                    .then((response) => {
                        console.log(response.data);
                        this.props.navigation.navigate('Verify', {
                            number: phone,
                            session: response.data,
                        })
                    })
                    .catch((err) => {
                        if (err) {
                            console.log(err.response);
                        };
                    });
                }}]
            )
        } else {
            title = 'Peringatan';
            message = 'salah';
            Alert.alert(
                title,
                message,
                [{text: 'Back', onPress: () => {
                    console.log('pressed back')
                }}]
            )
        }
    }

    render() {
        const { navigation } = this.props;
        const { params } = navigation.state;
        const { value, is_exist, borderColor } = this.state;
        const isNotEmptyAndGte4 = value && value.length > 4;
        const checkState = this.setMessage();

        let telepon = navigation.getParam('telepon', 'none')
        console.log(telepon.includes('telepon'))

        if (this.state.isLoading) {
            return (
                <ActivityIndicator style={{ marginTop: 20, alignSelf: 'center' }} />
            )
        }

        return (
            <Layout 
                level='3' 
                style={{ height: Dimensions.get('screen').height }}>
                {this.state.label.includes('telepon')
                ?
                    <Layout 
                        level='3'
                        style={{ padding: 20 }}>
                        <PhoneInput
                            ref={(ref) => this.phone = ref}
                            initialCountry='id'
                            textStyle={styles.phoneInput}
                        />
                        <Text category='h6' appearance='hint' style={{ marginTop: 20, marginBottom: 20 }}>
                            Kami akan mengirim kan SMS dengan kode konfirmasi kepada nomor Anda
                        </Text>

                        <Button onPress={this.handlePhone}>
                            Press
                        </Button>
                    </Layout>
                :
                    <Layout
                        level='3'
                        style={{ padding: 20 }}>
                        <Input
                            style={{ borderColor: 'transparent' }}
                            label={params.label}
                            value={value}
                            caption={checkState}
                            onChangeText={(text) => this.onChange(text)}
                            // onChange={this.onChange}
                            status={this.state.statusField}
                            onSubmitEditing={() => this.update()}
                            defaultValue={params.value && params.value}
                        />
                    </Layout>
                }
            </Layout>
        );
    };
};

const EditScreen = connect(mapStateToProps, mapDispatchToProps)(connectEditScreen);
export default EditScreen;

const styles = StyleSheet.create({
    container: {
      flex: 1,
        alignItems: 'center',
        padding: 20,
        paddingTop: 60,
    },
    info: {
        // width: 200,
        borderRadius: 5,
        backgroundColor: "#f0f0f0",
        padding: 10,
        marginTop: 20
    },
    button: {
    marginTop: 20,
    padding: 10
    },
    phoneInput: {
        fontSize: 20, 
        borderBottomWidth: 0.5
    }
  });
