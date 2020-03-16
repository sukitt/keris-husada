import { BaseURL, axiosBase } from '../../constants/Endpoint';
import { AsyncStorage } from 'react-native';
import { USER_TOKEN, TOKEN_REFRESH, USER_ACCOUNT, USERNAME, PASSWORD, LOGIN, TIME_LOGIN, LOGOUT, USER_ID, ROLE } from '../../constants/storageKey';


export const setLoading = (payload) => {
    return { type: 'SET_LOADING', payload }
}

/* Check */

export const isOnline = (payload) => {
    return { type: 'IS_ONLINE', payload }
}

/* Auth */
export const setId = (payload) => {
    return { type: 'SET_ID', payload }
}

export const setRole = (payload) => {
    return { type: 'SET_ROLE', payload }
}

export const tryLogin = () => {
    return { type: 'TRY_LOGIN' }
}

export const setToken = (payload) => {
    return { type: 'SET_TOKEN', payload }
}

export const setTokenRefresh = (payload) => {
    return { type: 'SET_TOKEN_REFRESH', payload }
}

export const verifyToken = (payload) => {
    return { type: 'VERIFY_TOKEN', payload }
}

export const pushError = (payload) => {
    return { type: 'PUSH_ERROR', payload }
}

export const setAvatar = (payload) => {
    return { type: 'SET_AVATAR', payload }
}

export const setUsername = (payload) => {
    return { type: 'SET_USERNAME', payload }
}

export const setPassword = (payload) => {
    return { type: 'SET_PASSWORD', payload }
}

export const setAccount = (payload) => {
    return { type: 'SET_ACCOUNT', payload }
}

export const setProfile = (payload) =>  {
    return { type: 'SET_PROFILE', payload }
}

export const setTimeRecieved = (payload) => {
    return { type: 'TIME_RECEIVED', payload }
}

export const reset = () => {
    return { type: 'RESET' }
}


/**
 * Action POST GET
 */


export const postUserLogin = (kwargs, saveTokenUsernameAndPassword=false) => {  
    return new Promise((resolve, reject) => {
        axiosBase.post('token/', kwargs)
        .then((response) => {
            if (response && response.status == 200) {
                let role;
                let time_login = new Date();
                switch (response.data.role) {
                    case 1:
                        role = 'mahasiswa';
                        break;
                    case 2:
                        role = 'dosen';
                    case 3:
                        role = 'admin';
                    default:
                        role = 'anonymous';
                        break;
                }

                if (saveTokenUsernameAndPassword) {
                    /* Set User Token to storage */
                    AsyncStorage.multiRemove([
                        USERNAME,
                        PASSWORD,
                        LOGOUT
                    ], (err) => {
                        if (err) {
                            throw new Error(err)
                        }
                        AsyncStorage.multiSet([
                            [USER_TOKEN, response.data.access],
                            [TOKEN_REFRESH, response.data.refresh],
                            [USERNAME, kwargs.username],
                            [PASSWORD, kwargs.password],
                            [USER_ID, response.data.id.toString()],
                            [ROLE, role],
                            [LOGIN, '1'],
                            [TIME_LOGIN, time_login.toString()],
                            [LOGOUT, '0'],
                        ], (err) => {
                            if (err) {
                                throw new Error(err)
                            }
                        })
                    })
                }
                resolve(response);
            };
        }) 
        .catch((err) => {
            reject(err);
        })
    })
};


export const getUserAccount = (args, token) => {
    return new Promise((resolve, reject) => {
        axiosBase.get(`user/${args}/`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        .then((res) => {
            AsyncStorage.setItem(
                USER_ACCOUNT, JSON.stringify(res.data)
            , (err) => {
                if (err) {
                    reject(err);
                }
            })
            resolve(res);
        })
        .catch((err) => reject(err))
        
    });
};


export const getUserProfile = async (url, username, token) => {

    try {
        const response = await axiosBase.get(url, {
            params: {
                search: username
            },
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        
        if (response.status === 200) {
            return response;
        };
    } catch (e) {
        throw new Error(e)
    }
    
}


export const userLogout = () => {
    return new Promise((resolve, reject) => {
        AsyncStorage.setItem(LOGOUT, '1', (err) => {
            if (err) {
                reject(err)
            };
            AsyncStorage.multiRemove([
                USER_TOKEN,
                TOKEN_REFRESH,
                LOGIN,
                TIME_LOGIN,
            ], (e) => {
                if (e) {
                    reject(e)
                }
                resolve();
            });
        })
    })
};


export const removeUserData = () => (
    new Promise((resolve, reject) => {
        AsyncStorage.multiRemove([
            LOGOUT,
            USERNAME,
            PASSWORD
        ], (err) => {
            if (err) {
                reject(err);
            };
            resolve();
        })
    })
);


export const verifyPhone = (args1, args2) => {
    return new Promise((resolve, reject) => {
        axiosBase.post('phone_verify/phone/register', {
            phone_number: args1
        },{
            headers: {
                Authorization: `Bearer ${args2}`
            }
        })
        .then((response) => {
            console.log(response.data.session_token)
            resolve(response);
        })
        .catch((err) => reject(err));
    })
}


export const updateUser = (id, data, token) => {
    return new Promise((resolve, reject) => {

        if (data) {
            axiosBase.patch(`user/${id}/`, data, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            .then((response) => {
                resolve(response)
            })
            .catch((err) => reject(err));
        } else {
            resolve('Gagal')
        }
    })
}
