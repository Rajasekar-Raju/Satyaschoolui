import {createStore, applyMiddleware} from 'redux';
import thunk from 'redux-thunk';
import createReducer from '../Reducer';

let middleware = [thunk];

const store = createStore(createReducer(), applyMiddleware(...middleware));

export default store;
