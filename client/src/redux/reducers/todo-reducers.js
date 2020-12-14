import { listTodosThunk, createTodoThunk, updateTodoThunk, deleteTodoThunk } from '../actions';
import moment from 'moment';

/**
 * Applies the given action to the given todo-list state, if applicable.
 * 
 * @param state the current list of todo items in the store
 * @param action the action to apply to the store
 */
export default function (state = [], action) {
    switch (action.type) {
        case listTodosThunk.actionTypes.success:
            return listTodosSuccess(state, action.payload);

        case createTodoThunk.actionTypes.success:
            return createTodoSuccess(state, action.payload);

        case updateTodoThunk.actionTypes.success:
            return updateTodoSuccess(state, action.payload);

        case deleteTodoThunk.actionTypes.success:
            return deleteTodoSuccess(state, action.payload);

        default:
            return state;
    }
}

/**
 * Returns a new todo list created by merging the old todo list and the one contained within the given payload.
 * 
 * The merged list will contain all todos from both lists, except in the case where more than one todo has the same id.
 * In that case, the one with the most recent "modified" date will be kept, and the other discarded.
 * 
 * @param oldState the old todo list
 * @param payload  the todo list to merge with the old one
 */
function listTodosSuccess(oldState, payload) {

    // Create a new array, where, foreach todo in the existing array...
    const mergedTodos = oldState.map((todo, index) => {

        // If an incoming todo has the same id as the todo at this index, AND that
        // incoming todo has a later modified time...
        const match = payload.find(inc => inc._id === todo._id);
        if (match && moment(match.modified).isAfter(todo.modified)) {
            // substitute the incoming todo
            return match;
        }

        // Otherwise, keep the current todo
        return todo;
    });

    // Now, add all the incoming todos which have different ids
    return mergedTodos.concat(payload.filter(todoA => oldState.find(todoB => todoA._id === todoB._id) === undefined));
}

/**
 * Returns a new array consisting of all items in the old todo list, plus the new todo item in the given payload.
 * 
 * @param oldState the old todo list
 * @param payload the single todo item to add to the list
 */
function createTodoSuccess(oldState, payload) {
    return [
        ...oldState,
        payload
    ];
}

/**
 * Returns a new array consisting of all items in the old todo list, except the one with an _id matching the given payload.
 * That todo item will be replaced by the item from the payload.
 * 
 * @param oldState the old todo list
 * @param payload the single todo item to add to the list
 */
function updateTodoSuccess(oldState, payload) {
    return oldState.map(oldTodo => {
        if (payload._id === oldTodo._id) {
            return payload;
        }
        else {
            return oldTodo;
        }
    });
}

/**
 * Returns a new array consisting of all items in the old todo list, except the one with an _id matching the given payload.
 * 
 * @param oldState the old todo list
 * @param payload the id of the todo that's been removed
 */
function deleteTodoSuccess(oldState, payload) {
    return oldState.filter(todo => todo._id !== payload);
}
