import React, { Component } from 'react';
import { connect } from 'react-redux';
import Constants from 'expo-constants';
import { 
    StyleSheet, 
    KeyboardAvoidingView, 
    View,
    Dimensions,
    TouchableOpacity,
    Alert,
} from 'react-native';

import { 
    Layout, 
    Text, 
    Button, 
} from '@ui-kitten/components'


// Componenet
import { SkypeIndicator } from 'react-native-indicators';
import MainFrom from '../components/form/login/MainForm';
import Logo from '../components/Logo';
import { MessageError } from '../components/MessageAlert';


// Redux

import { 
    postUserLogin, 
    getUserAccount, 
    setToken, 
    setAccount, 
    isOnline, 
    getUserProfile, 
    setProfile, 
    reset, 
    setTokenRefresh, 
    setLoading,
    removeUserData,
    setId,
    setRole,
    setTimeRecieved
} from '../redux/actions'; 
import SecondForm from '../components/form/login/SecondForm';
import ModalConfirm from '../components/ModalConfirm';


const mapStateToProps = (state) => {
    return {
        token: state.auth.token,
        username: state.auth.username,
        password: state.auth.password,
        account: state.auth.account,
        avatar: state.auth.avatar,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        dispatchSetId: (args) => (
            dispatch(setId(args))
        ),
        dispatchSetRole: (args) => (
            dispatch(setRole(args))
        ),
        dispatchSetToken: (args) => (
            dispatch(setToken(args))
        ),
        dispatchSetTokenRefresh: (args) => (
            dispatch(setTokenRefresh(args))
        ),
        dispatchSetTimeReceived: (args) => (
            dispatch(setTimeRecieved(args))
        ),
        dispatchSetAccount: (args) => (
            dispatch(setAccount(args))
        ),
        dispatchSetProfile: (args) => (
            dispatch(setProfile(args))
        ),
        dispatchIsOnline: (args) => (
            dispatch(isOnline(args))
        ),
        dispatchReset: () => (
            dispatch(reset())
        ),
    };
};

// Modal data
const data = [
    { title: 'Hapus' },
    { title: 'Batal' }
]

class connectLoginScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            message: '',
            visible: true,
            role: '',
            dataForm: {},
            retry: false,
            errorMessage: null 
        }
        this.handleSelected = this.handleSelected.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }

    setRole = (args) => {
        switch (args) {
            case 1:
                this.setState({
                    role: 'mahasiswa'
                });
                break;
            case 2:
                this.setState({
                    role: 'dosen'
                });
            case 3:
                this.setState({
                    role: 'admin'
                });
            default:
                this.setState({
                    role: 'anonymous'
                });
                break;
        };
    };

    toggleLoading = () => (
        this.setState(prev => ({ loading: !prev.loading }))
    )


    onSubmit = async () => {
        let kwargs;

        if (!this.state.retry) {
            if (this.isNotNull(this.props.username, this.props.password)) {
                kwargs = {
                    username: this.props.username,
                    password: this.props.password
                };
            } else {
                kwargs = this.login.getValue();
                this.setState({ dataForm: this.login.getValue() })
                this.login.clear();
            }
        } else {
            kwargs = this.state.dataForm;
            this.setState(prev => ({ retry: !prev.retry }))
        }
        // this.setState({ dataForm: kwargs });
        console.log(kwargs)
        this.toggleLoading()
        this.setState({ message: 'loading...'})
        postUserLogin(kwargs, true)
        .then((response) => {
            if (response && response.status == 200) {
                this.setRole(response.data.role);
                this.setState({ message: 'fetching data...' });

                this.props.dispatchSetId(response.data.id);
                this.props.dispatchSetRole(response.data.role);
                this.props.dispatchSetToken(response.data.access);
                this.props.dispatchSetTokenRefresh(response.data.refresh);
                this.props.dispatchSetTimeReceived(new Date().toUTCString())

                getUserAccount(response.data.id, response.data.access)
                .then((res) => {
                    if (res && res.status === 200) {
                        this.setState({ message: 'get account' })

                        this.props.dispatchSetAccount(res.data);

                        if (this.state.role === 'mahasiswa') {
                            getUserProfile('mahasiswa/', kwargs.username, response.data.access)
                            .then((ress) => {
                                if (ress && ress.status === 200) {
                                    this.setState({ message: 'get profile... '})
                                    this.props.dispatchSetProfile(ress.data.results[0]);
                                    this.props.dispatchIsOnline(true);
                                    this.toggleLoading()
                                    this.props.navigation.navigate('App');
                                }
                            })
                            .catch((err) => { throw new Error(err) })
                            
                        }
                    }
                })
                .catch((err) => {
                    console.log(err);
                    this.toggleLoading();
                })
            }
        })
        .catch((err) => {
            this.toggleLoading();
            console.log(err.message);
            MessageError(
                err.message, 
                this.onSubmit, 
                this.setState(prev => ({
                    rentry: !prev.rentry
                }))
            )
        })
    };

    isNotNull = (args1, args2) => {
        return args1 !== null && args2 !== null
    }

    // Modal 

    handleSelected = (index) => {
        switch (index) {
            case 0:
                return (
                    this.modal.toggleModal(),
                    removeUserData()
                    .then(() => {
                        this.props.dispatchReset();
                        this.props.navigation.navigate('Auth');
                    })
                    .catch((err) => {
                        console.log(err)
                    })
                    
                );
            
            case 1:
                return (
                    this.modal.toggleModal()
                );
        
            default:
                return (
                    this.modal.toggleModal()
                );
        }
    }
    
    render() {
        console.log(this.props.avatar)
        /* Rendering Componen */
        const LoadIndicator = (props) => (
            <View style={styles.bgOverlay}>
                <SkypeIndicator color='white' style={styles.skypeIndicator} />
                <Text style={styles.textIndicator}>{props.message}</Text>
            </View>
        );
        console.log(this.state.visible)
        let marginTopBtn = { marginTop: this.isNotNull(this.props.username, this.props.password)? 0: 50 };
        return (
            <Layout style={styles.container}>
                <Logo style={styles.logo} />
                
                <Layout style={styles.h}>
                    <Text style={styles.h1} category='h1'>Akper Keris Husada</Text>
                    <Text style={styles.italic} category='h2'>SIAKAD</Text>
                </Layout>
                
                <KeyboardAvoidingView behavior='position' keyboardVerticalOffset={20}>
                    <Layout style={styles.form}>
                        {
                            this.isNotNull(this.props.username, this.props.password)
                            ? <SecondForm 
                                source={{ uri: this.props.avatar }} 
                                />
                            : <MainFrom 
                                ref={(ref) => this.login = ref}
                            />
                        }
                    </Layout>
                </KeyboardAvoidingView>
                <Button 
                    style={marginTopBtn}
                    onPress={this.onSubmit}
                    status='primary'
                    size='large'
                    disabled={this.state.loading}>
                    {this.isNotNull(this.props.username, this.props.password)
                        ? `Masuk sebagai ${this.props.username}`
                        : `Masuk`}
                </Button>
                
                {this.isNotNull(this.props.username, this.props.password)
                    ? <Layout style={styles.layoutModal}>
                        <ModalConfirm 
                            ref={(ref) => this.modal = ref}
                            modalData={data}
                            title='Hapus'
                            titleModal='Hapus Akun'
                            subTitleModal={`Anda harus memasukkan nama\npengguna dan kata sandi saat Anda ingin\nmasuk selanjutnya.`}
                            paddingItemTop={14}
                            paddingItemBottom={14}
                            modalContainerStyle={styles.modalContainerStyle}
                            modalTitleStyle={{
                                marginBottom: 10
                            }}
                            handleSelected={this.handleSelected}
                        />
                        </Layout>
                    : null}
                    
                    {this.state.loading? <LoadIndicator message={this.state.message} />: null}
                {this.state.errorMessage && this.state.errorMessage}
            </Layout>
        );
    }
};

const LoginScreen = connect(mapStateToProps, mapDispatchToProps)(connectLoginScreen);
export default LoginScreen;

const BASE_WIDTH        = Dimensions.get('screen').width;
const BASE_HEIGHT       = Dimensions.get('screen').height;
const PADDING           = 15;
const FORM_HEIGHT       = BASE_HEIGHT / 4.5;
const STATUS_BAR_HEIGHT = Constants.statusBarHeight;

const styles = StyleSheet.create({
    container: {
        padding: PADDING,
        marginTop: STATUS_BAR_HEIGHT,
        height: BASE_HEIGHT,
    },
    bgOverlay: {
        flex: 1,
        position: 'absolute',
        top: '38%',
        bottom: '38%',
        left: '30%',
        right: '30%',
        alignItems: 'center',
        alignSelf: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
        borderRadius: 30
    },
    mtBtn: {
        marginTop: BASE_HEIGHT / 15
    },
    button: {
        margin: 8
    },
    h: {
        alignItems: "center", 
        marginTop: 20,
        marginBottom: 10
    },
    h1: {
        fontFamily: 'sans-serif-light', 
        fontSize: 27
    },
    italic: {
        fontStyle: "italic"
    },
    logo: {
        marginTop: BASE_HEIGHT / 15,
        alignSelf: "center",
        width: 100, 
        height: 100
    },
    form: {
        alignSelf: 'center',
        height: FORM_HEIGHT,
        width: BASE_WIDTH -50,
        justifyContent: 'center'
    },
    row: {
        marginTop: 10,
        flexDirection: 'row', 
        // flexWrap: 'wrap',
        borderRadius: 15
    },
    skypeIndicator: {
        position: 'absolute',
        top: '25%'
    },
    textIndicator: {
        color: 'white', 
        bottom: '25%', 
        position: 'absolute'
    },
    layoutModal: { 
        marginTop: 20, 
        height: 20, 
        alignSelf: 'center'
    },
    modalContainerStyle: {
        height: BASE_HEIGHT / 3,
        paddingTop: 10,
        paddingBottom: 2,
        paddingLeft: 2,
        paddingRight: 2
    }
})
