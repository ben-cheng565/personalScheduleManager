import rootReducer from './reducers';
import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';

/**
 * Persist by storing state in the local storage.
 */
function persistStore(state) {
    try{
        const serializedState = JSON.stringify(state);
        localStorage.setItem('state', serializedState);
    } catch (e) {
        console.log(e);
    }
}

/**
 * retrieve state from local storage.
 */
function loadFromLocalStorage() {
    try {
        const serializedState = localStorage.getItem('state');
        if (serializedState === null) {
            return undefined
        } else {
            return JSON.parse(serializedState)
        }
    } catch (e) {
        return undefined
    }
}

/**
 * Builds the Redux store, and adds in the redux-thunk and devtools middlewares.
 */
const persistState = loadFromLocalStorage();
const store = createStore(rootReducer, persistState, compose(
    applyMiddleware(thunk),

    window.__REDUX_DEVTOOLS_EXTENSION__ ? window.__REDUX_DEVTOOLS_EXTENSION__() : f => f // The devttools
))

store.subscribe(() => persistStore(store.getState()))

export const getStore = () => store;