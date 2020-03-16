import React from 'react';
import { connect } from 'react-redux';
import jwt_decode from 'jwt-decode';
import PhoneInput from '../components/form/phone';
import ValidationComponent from 'react-native-form-validator';
import { 
    StyleSheet, 
    Alert, 
    Dimensions, 
    ActivityIndicator, 
    KeyboardAvoidingView,
    AsyncStorage
} from 'react-native';
import {
    Layout,
    Text,
    Button,
    Icon,
    Input
} from '@ui-kitten/components';
import { 
    verifyPhone, 
    updateUser, 
    setAccount, 
    setToken,
    setTokenRefresh
} from '../redux/actions';
import { axiosBase } from '../constants/Endpoint';
import { isTokenExp, refreshToken, isTokenRefreshExp, getNewToken } from '../redux/actions/tokenAction';
import { USER_TOKEN } from '../constants/storageKey';


const EditUsername = (props) => {
    return (
        <>
        <Layout style={{ padding: 10 }}>
            <Input
                label='Saat ini'
                disabled={true}
                style={{
                    marginBottom: 30,
                }}
                labelStyle={{ fontSize: 15 }}
                textStyle={{ fontSize: 17 }}
                defaultValue={props.currentValue}
            />
        </Layout>
        <Layout style={{ padding: 10 }}>
            <Input
                {...props}
                label='Baru'
                labelStyle={{ fontSize: 15 }}
                textStyle={{ fontSize: 17 }}
            />
        </Layout>
        {props.divider}
        </>
    );
};

const EditPhone = (props) => {
    return (
        <>
        <Layout style={{ padding: 10 }}>
            <PhoneInput
                {...props}
            />
        </Layout>
        {props.divider}
        </>
    );
};

const EditEmail = (props) => {
    return (
        <>
        <Layout style={{ padding: 10 }}>
            <Input
                {...props}
                labelStyle={{ fontSize: 15 }}
                textStyle={{ fontSize: 17 }}
            />
        </Layout>
        {props.divider}
        </>
    );
};


const mapStateToProps = (state) => {
    return {
        id: state.auth.id,
        username: state.auth.username,
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
        setToken: (args) => (
            dispatch(setToken(args))
        ),
        setTokenRefresh: (args) => (
            dispatch(setTokenRefresh(args))
        ),
    }
}

class connectEditScreen extends ValidationComponent {
    static navigationOptions = ({ navigation }) => {
        let label = navigation.getParam('label', 'none');
        return {
            title: label.includes('telepon')? 'Nomor baru': `Ubah ${label.toLowerCase()}`,
        }
    }

    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            label: '',
            default_value: '',
            nama_pengguna: '',
            kata_sandi: '',
            alamat_email: '',
            telepon: '',
            isValid: false,
        }

        this.handlePress = this.handlePress.bind(this);
    }

    componentDidMount() {
        const { navigation } = this.props
        const label = navigation.getParam('label', 'none');
        const value = navigation.getParam('value', null);
        this.setState({
            ...this.state,
            label: label.toLowerCase(),
            default_value: value,
            isLoading: false,
        })
    }

    handlePress = () => {
        this.deviceLocale = 'id';

        const isValid = this.validate({
            nama_pengguna: {minlength: 5, maxlength: 10},
            alamat_email: {email: true},
            telepon: {number: true}
        });

        this.setState({isValid: isValid})
        if ( !isValid ) {
            Alert.alert(
                'Peringantan',
                this.getErrorMessages(),
                [{text: 'OK'}],
                {cancelable: false}
            )
        } else {
            this.handleUpdate()
        }
    }

    handleUpdate = () => {
        let context;
        
        switch (this.state.label) {
            case 'nama pengguna':
                const username = this.state.nama_pengguna
                context = { username: username }
                break;
            case 'kata sandi':
                const password = this.state.kata_sandi
                context = { password: password }
                break;
            case 'alamat email':
                const email = this.state.alamat_email
                context = { email: email }
                break;
            case 'nomor telepon':
                const telepon = this.state.telepon
                context = { phone_number: telepon }
                break;
            default:
                break;
        }

        if (!isTokenExp(this.props.token)) {
            this.setState({isLoading: true});
            updateUser(this.props.account.id, context, this.props.token)
            .then((response) => {
                this.props.setAccount(response.data)
                this.setState({isLoading: false});
                this.props.navigation.goBack();
            })
            .catch((err) => {
                if (err) {
                    alert(err.message)
                };
                this.setState({isLoading: false});
            });
        } else {
            let data = { 
                username: this.props.username,
                password: this.props.password
            }

            if (!isTokenRefreshExp(this.props.token_refresh)) {
                this.setState({isLoading: true});
                refreshToken(this.props.token_refresh)
                .then((response) => {
                    this.props.setToken(response.data.access)
                    updateUser(this.props.account.id, context, response.data.access)
                    .then((res) => {
                        this.props.setAccount(res.data);
                        this.setState({isLoading: false});
                        this.props.navigation.goBack();
                    })
                    .catch((err) => {
                        if (err) {
                            alert(err.message)
                        };
                        this.setState({isLoading: false});
                    });
                })
                .catch((err) => {
                    alert(err);
                    this.setState({isLoading: false});
                });
            } else {
                this.setState({isLoading: true});
                getNewToken(data)
                .then(response => {
                    this.props.setToken(response.data.access);
                    this.props.setTokenRefresh(response.data.refresh);
                    updateUser(this.props.account.id, context, response.data.access)
                    .then((res) => {
                        this.props.setAccount(res.data);
                        this.setState({isLoading: false});
                        this.props.navigation.goBack();
                    })
                    .catch((err) => {
                        if (err) {
                            alert(err.message)
                        };
                        this.setState({isLoading: false});
                    });
                })
                .catch((err) => {
                    alert(err);
                    this.setState({isLoading: false});
                });
            };
        };
    };

    render() {
        const Divider = (props) => <Layout level='4' style={[{ height: 3 }, props.style]} />
        if (this.state.isLoading) {
            return (
                <ActivityIndicator style={{margin: 20, alignSelf: 'center'}} />
            )
        }
        console.log(isTokenExp(this.props.token))
        return (
            <Layout style={{ 
                height: Dimensions.get('screen').height,
                marginTop: 20,
                }}>
                {this.state.label.includes('nama')?
                    <EditUsername
                        value={this.state.nama_pengguna || this.state.default_value}
                        onChangeText={(text) => (
                            this.setState({...this.state, nama_pengguna: text}
                        ))}
                        // autoFocus={true}
                        currentValue={this.state.default_value}
                        divider={<Divider style={{ marginBottom: 280 }} />}
                    />:
                    null
                }
                
                {this.state.label.includes('email')?
                    <EditEmail
                        label={this.state.label}
                        value={this.state.alamat_email || this.state.default_value}
                        onChangeText={(text) => (
                            this.setState({...this.state, alamat_email: text}
                        ))}
                        defaultValue={this.state.default_value}
                        divider={<Divider style={{ marginBottom: 390 }} />}
                    />:
                    null
                }
                {this.state.label.includes('telepon')? 
                    <EditPhone 
                        initialCountry='id'
                        style={{
                            marginBottom: 50
                        }}
                        textStyle={{
                            fontSize: 20, 
                            borderBottomWidth: 0.5,
                        }}
                        onChangePhoneNumber={(number) => (
                            this.setState({...this.state, telepon: `+62${number}`})
                        )}
                        divider={<Divider style={{ marginBottom: 350 }} />}
                    />:
                    null
                }
               
                
                <KeyboardAvoidingView 
                    behavior='position' 
                    keyboardVerticalOffset={95} 
                    >
                    <Divider />
                    <Layout style={{
                        flexDirection: 'row',
                        justifyContent: 'flex-end',
                    }}>
                        <Button 
                            onPress={this.handlePress} 
                            style={{
                                borderRadius: 50,
                                margin: 10,
                                width: 100,
                            }}>
                            Selesai
                        </Button>
                    </Layout>
                </KeyboardAvoidingView>
        </Layout>
        );
    };
};

const EditScreenCustom = connect(mapStateToProps, mapDispatchToProps)(connectEditScreen);
export default EditScreenCustom;