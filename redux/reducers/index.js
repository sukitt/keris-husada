import { combineReducers } from "redux";
import checkReducer from './checkReducer';
import authReducer from "./authReducer";

const rootReducer = combineReducers({
    check: checkReducer,
    auth: authReducer,
})

export default rootReducer;
