import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { AsyncStorage, StyleSheet } from 'react-native';
import { Layout, Text } from '@ui-kitten/components';
import { SkypeIndicator } from 'react-native-indicators';
import jwt_decode from 'jwt-decode'

// Constants

import { 
    USER_TOKEN, 
    USERNAME, 
    PASSWORD, 
    LOGOUT, 
    TIME_LOGOUT, 
    LOGIN, 
    TIME_LOGIN, 
    TOKEN_REFRESH,
    ROLE,
    USER_ID,
    USER_ACCOUNT
} from '../constants/storageKey';

/* Redux */
import { 
    setToken, 
    setUsername, 
    setPassword, 
    getUserAccount, 
    setAccount, 
    postUserLogin, 
    userLogout,
    getUserProfile, 
    setProfile, 
    isOnline, 
    setAvatar
} from '../redux/actions';
import Notice from '../components/Notice';
import { isTokenExp } from '../redux/actions/tokenAction';

const mapStateToProps = (state) => {
    return {
        
        token: state.auth.token,
        username: state.auth.username,
        account: state.auth.account,
        profile: state.auth.profile,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        setToken: (args) => (
            dispatch(setToken(args))
        ),
        setAvatar: (args) => (
            dispatch(setAvatar(args))
        ),
        setUsername: (args) => (
            dispatch(setUsername(args))
        ),
        setPassword: (args) => (
            dispatch(setPassword(args))
        ),
        setAccount: (kwargs) => (
            dispatch(setAccount(kwargs))
        ),
        setProfile: (kwargs) => (
            dispatch(setProfile(kwargs))
        ),
        isOnline: (args) => (
            dispatch(isOnline(args))
        ),
    };
};

const connectAuthLoadingScreen = (props) => {
    /* React Hook State */
    const [loading, setLoading]     = useState(false);
    const [message, setMessage]     = useState('');

    const toggleLoading = () => (
        setLoading(!loading)
    )

    const _removeToken = (args) => {
        return new Promise((resolve, reject) => {
            AsyncStorage.removeItem(args)
                .then(() => {
                    setMessage('Remove token store');
                    resolve();
                })
                .catch((err) => {
                    reject(err);
                });
        });
    };

    const _fetchAllData = (args1, args2, args3) => {
        // fetch account user
        const { navigation } = props;
        return getUserAccount(args1, args2)
        .then((res_account) => {
            console.log(res_account, args1, args2)
            if (res_account !== undefined && res_account.status === 200) {
                props.setAccount(res_account.data);
                props.setToken(args2);
                props.setAvatar(res_account.data.avatar);

                // fetch profile user
                if (args3 !== 'anonymous' && args3 !== 'admin') {
                    getUserProfile(args3, args1, args2)
                    .then((res_profile) => {
                        if (res_profile.status === 200) {
                            toggleLoading();
                            props.setProfile(res_profile.data.results[0]);
                            props.isOnline(true);
                            setTimeout(() => {
                                navigation.navigate('App');
                            }, 2000);
                        }
                    })
                    .catch((err) => {
                        toggleLoading();
                        alert(`Error at getuserprofile: ${err}`);
                    })
                } else {
                    toggleLoading();
                    props.isOnline(true);
                    navigation.navigate('App');
                }
            }
        })
        .catch((err) => {
            const goToAuth = () => navigation.navigate('Auth');
            setLoading(false);
            if (err && err.response !== undefined) {
                switch (err.response) {
                    case 402:
                        return goToAuth();
                
                    case 403:
                        return goToAuth();
    
                    case 404:
                        return goToAuth();
    
                    default:
                        break;
                }
            } else {
                return goToAuth()
            }
        })
    }

    /* React Hook Effect/LifeCycle */
    useEffect(() => {
        setLoading(true);
        setMessage('Loading...')
        
        const _retrieveDataFromStore = (
            args1, args2, args3,
            args4, args5, args6,
            args7, args8, args9,
            args10,
        ) => (
            new Promise((resolve, reject) => {
                return AsyncStorage.multiGet([
                    args1, args2, args3, 
                    args4, args5, args6,
                    args7, args8, args9,
                    args10
                ])
                    .then((data) => {
                        // console.log(data);
                        resolve(data);
                    })
                    .catch(() => reject('Not Authenticated'))
            })
        );

        _retrieveDataFromStore(
                USERNAME, PASSWORD, USER_ID, 
                USER_TOKEN, TOKEN_REFRESH, ROLE, 
                LOGIN, TIME_LOGIN, LOGOUT, USER_ACCOUNT
            )
            .then(res => {
                console.log(res)
                setMessage('Fetching data...');
                /**
                 *  fetch from storage
                 */
                let user          = res[0][1];
                let pass          = res[1][1];
                let id            = res[2][1];
                let token         = res[3][1];
                let refresh       = res[4][1];
                let role          = res[5][1];
                let login         = res[6][1];
                let time_login    = res[7][1];
                let logout        = res[8][1];
                let account       = res[9][1];

                if (user !== null && pass !== null) {
                    props.setUsername(user);
                    props.setPassword(pass);
                    const Account   = JSON.parse(account);
                    if (account !== null) {
                        props.setAvatar(Account.avatar);
                    }


                    
                    if (login && login === '1' && token !== null) {
                        console.log('login true');
                        /* check expired token */
                        if (isTokenExp(token)) {
                            console.log('token expired');
                            setMessage('Token was expired...');
                            _removeToken(USER_TOKEN)
                            .then(() => {
                                setLoading(false);
                                props.navigation.navigate('Auth');
                            })
                            .catch((err) => {
                                if (err) {
                                    Notice(err, 'danger');
                                }
                            })
                        } else {
                            _fetchAllData(parseInt(id), token, role);
                        }

                    } else if (logout && logout === '1') {
                        setLoading(false);
                        props.navigation.navigate('Auth');
                        
                    } else {
                        setLoading(false);
                        props.navigation.navigate('Auth');

                    }
                } else {
                    setLoading(false);
                    props.navigation.navigate('Auth');
                }
            })
            .catch(err => {
                setLoading(false)
                console.log(err)
                throw new Error(err);
            });
    }, []);
    
    return (
        <Layout level='1' style={styles.container}>
            <Layout style={styles.h80}>
                {loading? <SkypeIndicator color='black' /> : null}
                <Text category='h6'>{message}</Text>
            </Layout>
        </Layout>
    )
}

const AuthLoadingScreen = connect(mapStateToProps, mapDispatchToProps)(connectAuthLoadingScreen);
export default AuthLoadingScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    }, 
    h80: {
        height: 80
    }
})