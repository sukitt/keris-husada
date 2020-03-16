import { SET_TOKEN, SET_PROFILE, SET_USERNAME, RESET, SET_ACCOUNT, SET_TOKEN_REFRESH, SET_PASSWORD, SET_AVATAR, SET_ID, SET_ROLE, TIME_RECEIVED } from '../actions/types';


const initalState = {
    id: null,
    role: 'anonymous',
    avatar: '',
    username: null,
    password: null,
    token: null,
    token_refresh: null,
    received_token: null,
    account: {},
    profile: {},
}

const received = new Date()

export default function authReducer(state = initalState, action) {
    switch (action.type) {

        case  SET_ID:
            return {
                ...state,
                id: action.payload
            }

        case SET_ROLE:
            switch (action.payload) {
                case 1:
                    return {
                        ...state,
                        role: 'mahasiswa'
                    }
                
                case 2:
                    return {
                        ...state,
                        role: 'dosen'
                    }
                
                case 3:
                    return {
                        ...state,
                        role: 'admin'
                    }

                default:
                    return state;
            }

        case SET_AVATAR:
            return {
                ...state,
                avatar: action.payload
            }

        case SET_USERNAME:
            return {
                ...state,
                username: action.payload
            };

        case SET_PASSWORD:
            return {
                ...state,
                password: action.payload
            }

        case SET_TOKEN:
            return {
                ...state,
                token: action.payload
            };
        
        case SET_TOKEN_REFRESH:
            return {
                ...state,
                token_refresh: action.payload
            };
        case TIME_RECEIVED:
            return {
                ...state,
                received_token: action.payload
            }

        case SET_ACCOUNT:
            return {
                ...state,
                account: action.payload
            };

        case SET_PROFILE:
            return {
                ...state,
                profile: action.payload
            };
        
        case RESET:
            return state = initalState;

        default:
            return state;
    }
}
