import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import { connect } from 'react-redux';
import { withRouter, useParams, useHistory } from 'react-router-dom';
import {
    listTodosThunk,
    createTodoThunk,
    updateTodoThunk,
    deleteTodoThunk,
    sortTodos,
    sortTodoswithDirection,
    groupTodos, groupCompletedItemsSepe
} from '../redux/actions';
import TodoList from '../components/todo-list';
import AddIcon from '@material-ui/icons/Add';
import Fab from '@material-ui/core/Fab';
import { Switch, Route } from 'react-router-dom';
import TodoDetailsDialog from '../components/todo-details-dialog';
import Select from '@material-ui/core/Select';
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import moment, {now} from 'moment';




/**
 * A "page-level" component that's hooked into the Redux store to get the list of todo items. When this component
 * mounts, it will also trigger an API call for the most recent items.
 * 
 * This component contains the logic to toggle completed status, and initiate the creation / update / delete of items.
 */
class ToDoManager extends React.Component {

    /**
     * When an instance of this is created, dispatch an API call to load the most recent todos
     */
    constructor(props) {
        super(props);
        this.props.dispatchListTodos();
    }

    /**
     * Called when a todo item's "toggle complete" icon is clicked. Dispatches the appropriate update action.
     */
    handleToggleComplete(todo) {
        this.props.dispatchUpdateTodo({ ...todo, isComplete: !todo.isComplete, modified: new Date() });
    }

    /**
     * Called when a todo item's "edit" icon is clicked.
     * 
     * Navigates appropriately to show the "edit" dialog for the correct todo
     */
    handleEdit(todo) {
        this.props.history.push(`/edit/${todo._id}`);
    }

    /**
     * Called when the "add" FAB is clicked.
     * 
     * Navigates appropriately to show the "add" dialog
     */
    handleAdd() {
        this.props.history.push('/add');
    }

    /**
     * Called when a todo has been successfully edited by the dialog.
     * 
     * Dispatches that change to the server and redirects the user away from the dialog box.
     */
    handleTodoEdited(todo) {
        this.props.dispatchUpdateTodo(todo);
        this.props.history.push("/");
    }

    /**
     * Called when a todo has been created by the dialog.
     * 
     * Dispatches the new todo to the server and redirects the user away from the dialog box.
     */
    handleTodoAdded(todo) {
        this.props.dispatchCreateTodo(todo);
        this.props.history.push("/");
    }

    /**
     * Called when a todo item's "delete" icon is clicked.
     * 
     * Dispatches an action that will delete this todo from the server.
     */
    handleDelete(todo) {
        this.props.dispatchDeleteTodo(todo);
    }

    /**
     * Called when the sortBy Selector is changed.
     *
     * Dispatches the appropriate update action.
     */
    handleSortByChange(sortBy) {
        this.props.dispatchSortTodo(sortBy);
    }

    /**
     * Called when the sort direction Selector is changed.
     *
     * Dispatches the appropriate update action.
     */
    handleSortDirectionChange(sortDirection) {
        this.props.dispatchSortTodoWithDirection(sortDirection);
    }

    /**
     * Called when the groupBy Selector is changed.
     *
     * Dispatches the appropriate update action.
     */
    handleGroupByChange(groupBy) {
        this.props.dispatchGroupTodos(groupBy);
    }

    /**
     * Called when the checkbox is clicked.
     *
     * Dispatches the appropriate update action.
     */
    handleCheckBoxChange(event) {
        this.props.dispatchGroupCompletedItems(event);
    }

    /**
     * Render logic. If there are any todos, renders a ToDoList to display them. Otherwise, renders a message letting the user
     * know they should add some items.
     * 
     * Also renders a heading, and an "add" button.
     * 
     * Finally, renders the "add" / "edit" dialog box if required.
     */
    render() {
        const { classes, todos, history, filters } = this.props;

        return (
            <div>
                <Typography variant="h4" className={classes.header}>Stuff to get done</Typography>
                <FormControl variant="outlined" className={classes.formControl}>
                    <InputLabel id="sort-by-label">Sort by</InputLabel>
                    <Select labelId="sort-by-label" value={filters.sortBy}
                            onChange={event => this.handleSortByChange(event.target.value)} label="Sort by" >
                        <MenuItem value=""><em>None</em></MenuItem>
                        <MenuItem value='title'>Title</MenuItem>
                        <MenuItem value='createDate'>Created date</MenuItem>
                        <MenuItem value='dueDate'>Due date</MenuItem>
                    </Select>
                </FormControl>
                <FormControl variant="outlined" className={classes.formControl}>
                    <InputLabel id="direction-label">Direction</InputLabel>
                    <Select labelId="direction-label" value={filters.sortDirection}
                            onChange={event => this.handleSortDirectionChange(event.target.value)} label="Direction" >
                        <MenuItem value='ascending'>Ascending</MenuItem>
                        <MenuItem value='descending'>Descending</MenuItem>
                    </Select>
                </FormControl>
                <FormControl variant="outlined" className={classes.formControl}>
                    <InputLabel id="group-by-label">Group by</InputLabel>
                    <Select labelId="group-by-label" value={filters.groupBy}
                            onChange={event => this.handleGroupByChange(event.target.value)} label="Group by" >
                        <MenuItem value=""><em>None</em></MenuItem>
                        <MenuItem value='priority'>Priority</MenuItem>
                        <MenuItem value='dueStatus'>Due status</MenuItem>
                        <MenuItem value='color'>Color</MenuItem>
                    </Select>
                </FormControl>
                <FormControlLabel className={classes.formControlLabel}
                    control={
                        <Checkbox checked={filters.separateCompleted} name="checkBox" color="primary"
                                  onChange={event => this.handleCheckBoxChange(event.target.checked)} />
                    }
                    label="Group completed items separately"
                />

                {(todos && todos.length > 0) ? (
                        <GroupedTodos todos={todos}
                                      onToggleCompleteClick={todo => this.handleToggleComplete(todo)}
                                      onEditClick={todo => this.handleEdit(todo)}
                                      onDeleteClick={todo => this.handleDelete(todo)}
                                      groupBy={filters.groupBy}
                                      seperateCompleted={filters.separateCompleted}/>
                )
                    : (
                        <Typography>
                            You have nothing to do <span role="img" aria-label="sad">😿</span> But fear not! You can start organizing
                            yourself using the <span role="img" aria-label="add">➕</span> button below! <span role="img" aria-label="happy">😺</span>
                        </Typography>
                    )
                }
                <div className={classes.addBox}>
                    <Fab color="primary" aria-label="add" title="Add" onClick={() => this.handleAdd()}><AddIcon /></Fab>
                </div>
                <Switch>
                    <Route path="/edit/:id">
                        <TodoDetailsDialogWithParams todos={todos} onOk={todo => this.handleTodoEdited(todo)} onCancel={() => history.goBack()} />
                    </Route>
                    <Route path="/add">
                        <TodoDetailsDialog open title="What do you need to do?" onOk={todo => this.handleTodoAdded(todo)} onCancel={() => history.goBack()} />
                    </Route>
                </Switch>
            </div>
        );
    }
}

/**
 * Renders a TodoDetailsDialog with its todo prop set to the todo whose _id matches the :id route param.
 * 
 * If no such todo exists, the browser will be sent "backwards" in the history.
 */
function TodoDetailsDialogWithParams({ todos, title, onOk, onCancel }) {
    const { id } = useParams();
    const todo = todos.find(t => t._id === id);
    const history = useHistory();
    if (todo) {
        return <TodoDetailsDialog open title={title} todo={todo} onOk={onOk} onCancel={onCancel} />
    }
    else {
        history.goBack();
        return <div></div>;
    }
}

/**
 * Renders a grouped todosList with its todos prop and a group by attribute, and the group completed items seperately prop.
 *
 * If no such todo exists, the browser will render an empty <div>.
 */
function GroupedTodos({todos, onToggleCompleteClick, onEditClick, onDeleteClick, groupBy, seperateCompleted}) {
    let todosHigh, todosMedium, todosLow, todosOverdue, todosUpcoming, todosFuture, completedTodos;
    let todosRed, todosGreen, todosBlue;

    if (seperateCompleted) {
        completedTodos = todos.filter((todo) => {
            if (todo.isComplete) {
                return todo;
            }
        });
    }

    switch (groupBy) {
        case 'priority':
            if (seperateCompleted) {
                 todosHigh = todos.filter((todo) => {
                    if (todo.priority === 'High' && !todo.isComplete) {
                        return todo;
                    }
                });

                todosMedium = todos.filter((todo) => {
                    if (todo.priority === 'Medium' && !todo.isComplete) {
                        return todo;
                    }
                });

                todosLow = todos.filter((todo) => {
                    if (todo.priority === 'Low' && !todo.isComplete) {
                        return todo;
                    }
                });
            }
            else {
                todosHigh = todos.filter((todo) => {
                    if (todo.priority === 'High') {
                        return todo;
                    }
                });

                todosMedium = todos.filter((todo) => {
                    if (todo.priority === 'Medium') {
                        return todo;
                    }
                });

                todosLow = todos.filter((todo) => {
                    if (todo.priority === 'Low') {
                        return todo;
                    }
                });
            }

            return <div>
                {(todosHigh && todosHigh.length > 0) ? (
                    <Typography variant="h6" className={styles.groupTitle}>High priority</Typography>

                ) : <div></div>}

                {(todosHigh && todosHigh.length > 0) ? (
                    <TodoList
                        todos={todosHigh}
                        onToggleCompleteClick={onToggleCompleteClick}
                        onEditClick={onEditClick}
                        onDeleteClick={onDeleteClick}/>
                ) : <div></div>}

                { (todosMedium && todosMedium.length > 0) ? (
                    <Typography variant="h6" className={styles.groupTitle}>Medium priority</Typography>

                ): <div></div> }

                {(todosMedium && todosMedium.length > 0) ? (
                    <TodoList
                        todos={todosMedium}
                        onToggleCompleteClick={onToggleCompleteClick}
                        onEditClick={onEditClick}
                        onDeleteClick={onDeleteClick}/>
                ): <div></div> }

                { (todosLow && todosLow.length > 0) ? (
                    <Typography variant="h6" className={styles.groupTitle}>Low priority</Typography>

                ): <div></div> }

                {(todosLow && todosLow.length > 0) ? (
                    <TodoList
                        todos={todosLow}
                        onToggleCompleteClick={onToggleCompleteClick}
                        onEditClick={onEditClick}
                        onDeleteClick={onDeleteClick}/>
                ): <div></div> }

                { (completedTodos && completedTodos.length > 0) ? (
                    <Typography variant="h6" className={styles.groupTitle}>Completed items</Typography>

                ): <div></div> }

                {(completedTodos && completedTodos.length > 0) ? (
                    <TodoList
                        todos={completedTodos}
                        onToggleCompleteClick={onToggleCompleteClick}
                        onEditClick={onEditClick}
                        onDeleteClick={onDeleteClick}/>
                ): <div></div> }
            </div>;

        case 'dueStatus':
            if (seperateCompleted) {
                todosOverdue = todos.filter((todo) => {
                    if (moment(todo.due).isBefore(now()) && !todo.isComplete) {
                        return todo;
                    }
                });

                todosUpcoming = todos.filter((todo) => {
                    if (moment(todo.due).isAfter(now()) && moment(todo.due).isBefore(now() + 2*24*60*60*1000) && !todo.isComplete) {
                        return todo;
                    }
                });

                todosFuture = todos.filter((todo) => {
                    if (moment(todo.due).isAfter(now() + 2*24*60*60*1000) && !todo.isComplete) {
                        return todo;
                    }
                });
            }
            else {
                todosOverdue = todos.filter((todo) => {
                    if (moment(todo.due).isBefore(now())) {
                        return todo;
                    }
                });

                todosUpcoming = todos.filter((todo) => {
                    if (moment(todo.due).isAfter(now()) && moment(todo.due).isBefore(now() + 2*24*60*60*1000)) {
                        return todo;
                    }
                });

                todosFuture = todos.filter((todo) => {
                    if (moment(todo.due).isAfter(now() + 2*24*60*60*1000)) {
                        return todo;
                    }
                });
            }

            return <div>
                {(todosOverdue && todosOverdue.length > 0) ? (
                    <Typography variant="h6" className={styles.groupTitle}>Overdue</Typography>

                ) : <div></div>}

                {(todosOverdue && todosOverdue.length > 0) ? (
                    <TodoList
                        todos={todosOverdue}
                        onToggleCompleteClick={onToggleCompleteClick}
                        onEditClick={onEditClick}
                        onDeleteClick={onDeleteClick}/>
                ) : <div></div>}

                { (todosUpcoming && todosUpcoming.length > 0) ? (
                    <Typography variant="h6" className={styles.groupTitle}>Upcoming</Typography>

                ): <div></div> }

                {(todosUpcoming && todosUpcoming.length > 0) ? (
                    <TodoList
                        todos={todosUpcoming}
                        onToggleCompleteClick={onToggleCompleteClick}
                        onEditClick={onEditClick}
                        onDeleteClick={onDeleteClick}/>
                ): <div></div> }

                { (todosFuture && todosFuture.length > 0) ? (
                    <Typography variant="h6" className={styles.groupTitle}>In the future...</Typography>

                ): <div></div> }

                {(todosFuture && todosFuture.length > 0) ? (
                    <TodoList
                        todos={todosFuture}
                        onToggleCompleteClick={onToggleCompleteClick}
                        onEditClick={onEditClick}
                        onDeleteClick={onDeleteClick}/>
                ): <div></div> }

                { (completedTodos && completedTodos.length > 0) ? (
                    <Typography variant="h6" className={styles.groupTitle}>Completed items</Typography>

                ): <div></div> }

                {(completedTodos && completedTodos.length > 0) ? (
                    <TodoList
                        todos={completedTodos}
                        onToggleCompleteClick={onToggleCompleteClick}
                        onEditClick={onEditClick}
                        onDeleteClick={onDeleteClick}/>
                ): <div></div> }
            </div>;

        case 'color':
            if (seperateCompleted) {
                todosRed = todos.filter((todo) => {
                    if (todo.color === 'Red' && !todo.isComplete) {
                        return todo;
                    }
                });

                todosGreen = todos.filter((todo) => {
                    if (todo.color === 'Green' && !todo.isComplete) {
                        return todo;
                    }
                });

                todosBlue = todos.filter((todo) => {
                    if (todo.color === 'Blue' && !todo.isComplete) {
                        return todo;
                    }
                });
            }
            else {
                todosRed = todos.filter((todo) => {
                    if (todo.color === 'Red') {
                        return todo;
                    }
                });

                todosGreen = todos.filter((todo) => {
                    if (todo.color === 'Green') {
                        return todo;
                    }
                });

                todosBlue = todos.filter((todo) => {
                    if (todo.color === 'Blue') {
                        return todo;
                    }
                });
            }

            return <div>
                {(todosRed && todosRed.length > 0) ? (
                    <Typography variant="h6" className={styles.groupTitle}>Red</Typography>

                ) : <div></div>}

                {(todosRed && todosRed.length > 0) ? (
                    <TodoList
                        todos={todosRed}
                        onToggleCompleteClick={onToggleCompleteClick}
                        onEditClick={onEditClick}
                        onDeleteClick={onDeleteClick}/>
                ) : <div></div>}

                { (todosGreen && todosGreen.length > 0) ? (
                    <Typography variant="h6" className={styles.groupTitle}>Green</Typography>

                ): <div></div> }

                {(todosGreen && todosGreen.length > 0) ? (
                    <TodoList
                        todos={todosGreen}
                        onToggleCompleteClick={onToggleCompleteClick}
                        onEditClick={onEditClick}
                        onDeleteClick={onDeleteClick}/>
                ): <div></div> }

                { (todosBlue && todosBlue.length > 0) ? (
                    <Typography variant="h6" className={styles.groupTitle}>Blue</Typography>

                ): <div></div> }

                {(todosBlue && todosBlue.length > 0) ? (
                    <TodoList
                        todos={todosBlue}
                        onToggleCompleteClick={onToggleCompleteClick}
                        onEditClick={onEditClick}
                        onDeleteClick={onDeleteClick}/>
                ): <div></div> }

                { (completedTodos && completedTodos.length > 0) ? (
                    <Typography variant="h6" className={styles.groupTitle}>Completed items</Typography>

                ): <div></div> }

                {(completedTodos && completedTodos.length > 0) ? (
                    <TodoList
                        todos={completedTodos}
                        onToggleCompleteClick={onToggleCompleteClick}
                        onEditClick={onEditClick}
                        onDeleteClick={onDeleteClick}/>
                ): <div></div> }
            </div>;

        default:
            return <TodoList
                    todos={todos}
                    onToggleCompleteClick={onToggleCompleteClick}
                    onEditClick={onEditClick}
                    onDeleteClick={onDeleteClick}/>;
    }
}
/**
 * Sort todos according to sortBy attribute and sortDirection.
 *
 * If no sortBy attribute, then do not sort todos.
 */
function dataFilter(todos, {sortBy, sortDirection}) {
    switch (sortBy) {
        case 'title':
            if (sortDirection === 'ascending') {
                return todos.slice().sort((a, b) => a['title'].localeCompare(b['title'])) ;
            } else {
                return todos.slice().sort((a, b) => b['title'].localeCompare(a['title'])) ;

            }
        case 'createDate':
            if (sortDirection === 'ascending') {
                return todos.slice().sort((a, b) => a['created'] > b['created'] ? 1 : -1);
            } else {
                return todos.slice().sort((a, b) => a['created'] < b['created'] ? 1 : -1);

            }
        case 'dueDate':
            if (sortDirection === 'ascending') {
                return todos.slice().sort((a, b) => a['due'] > b['due'] ? 1 : -1);
            } else {
                return todos.slice().sort((a, b) => a['due'] < b['due'] ? 1 : -1);

            }
        default:
            return todos;
    }

}

/**
 * Give the ToDoManager access to the todos from the Redux store
 */
const mapStateToProps = state => {

    return {
        todos: dataFilter(state.todos, state.filters),
        filters: state.filters
    }
}


/**
 * Give the ToDoManager access to these Redux actions which dispatch API calls
 */
const mapDispatchToProps = {
    dispatchListTodos: listTodosThunk.thunk,
    dispatchCreateTodo: createTodoThunk.thunk,
    dispatchUpdateTodo: updateTodoThunk.thunk,
    dispatchDeleteTodo: deleteTodoThunk.thunk,
    dispatchSortTodo: sortTodos,
    dispatchSortTodoWithDirection: sortTodoswithDirection,
    dispatchGroupTodos: groupTodos,
    dispatchGroupCompletedItems: groupCompletedItemsSepe
}

/**
 * Defines CSS classes with styles used by this component
 */
const styles = theme => ({
    formControl: {
        margin: theme.spacing(1),
        minWidth: 180,
    },
    formControlLabel: {
        alignSelf: 'center',
        marginTop: '15px',
    },
    selectEmpty: {
        marginTop: theme.spacing(2),
    },
    header: {
        marginBottom: '20px'
    },
    groupTitle: {
        marginTop: '15px',
        marginBottom: '5px'
    },
    addBox: {
        marginTop: '20px',
        display: 'flex',
        flexDirection: 'row-reverse'
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(withRouter(ToDoManager)));