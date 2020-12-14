/**
 * Returns a list of all todos on the server
 */
export async function listTodos() {
    const response = await fetch('/api/todos');
    const todos = await response.json();
    return todos;
}

/**
 * Creates a new todo with the given info on the server
 * 
 * @param todo the todo to create
 * @returns the todo that was created on the server, which should be the same but with an _id
 */
export async function createTodo(todo) {
    const response = await fetch('/api/todos', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(todo)
    });
    const fromServer = await response.json();
    return fromServer;
}

/**
 * Updates the todo with the given id on the server
 * 
 * @param todo the todo to update
 * @returns the todo that was updated on the server, which should be the same
 */
export async function updateTodo(todo) {
    const response = await fetch(`/api/todos/${todo._id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(todo)
    });
    const fromServer = await response.json();
    return fromServer;
}

/**
 * Deletes the given todo from the server
 * 
 * @param todo the todo to delete
 * @returns the id of the todo that was deleted
 */
export async function deleteTodo(todo) {
    await fetch(`/api/todos/${todo._id}`, {
        method: 'DELETE'
    });
    return todo._id;
}
