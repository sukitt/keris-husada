import {  SET_LOADING, IS_ONLINE } from '../actions/types';

const initialState = {
    online: false,
}

export default function checkReducer(state = initialState, action) {

    switch (action.type) {
        
        case IS_ONLINE:
            return {
                ...state,
                online: action.payload
            }
    
        default:
            return state;
    }
}