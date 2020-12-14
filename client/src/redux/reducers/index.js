import { combineReducers } from 'redux';
import todos from './todo-reducers';
import filters from './sort-reducers'

export default combineReducers({
    todos,
    filters
});