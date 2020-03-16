import { SET_LANGUAGE } from '../actions/types';

const initalState = {
    language: 'id',
};

export default function translationReducer(state = initalState, actions) {
    if (actions.type === SET_LANGUAGE) {
        return { language: actions.payload }
    } else {
        return state;
    }
}