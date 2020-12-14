import Api from '../api';
import { createApiThunks } from './utils';

/**
 * Uses a provided utility function to create all thunk actions which dispatch API calls, along with all "child actions"
 * (e.g. "loading", "success", "error" actions).
 */
export const {
    listTodosThunk,
    createTodoThunk,
    updateTodoThunk,
    deleteTodoThunk
} = createApiThunks(Api);

export const sortTodos = (sortType) => ({
    type: 'SORT_BY',
    sortType
});

export const sortTodoswithDirection = (sortDirection) => ({
    type: 'SORT_DIRECTION',
    sortDirection
});

export const groupTodos = (groupBy) => ({
    type: 'GROUP_BY',
    groupBy
});

export const groupCompletedItemsSepe = (separateCompleted) => ({
    type: 'GROUP_COMPLETED_ITEMS_SEPERATELY',
    separateCompleted
});