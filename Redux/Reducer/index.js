import { combineReducers } from "redux";
import chat from "./chat";

const createReducer = () =>
  combineReducers({
    chat,
  });

export default createReducer;
