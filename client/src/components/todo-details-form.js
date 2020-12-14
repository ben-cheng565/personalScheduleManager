import React from 'react';
import moment from 'moment';
import {
    withStyles,
    TextField, Grid,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    FormControlLabel,
    Checkbox,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions
} from '@material-ui/core';
import { DateTimePicker } from '@material-ui/pickers';
import green from "@material-ui/core/colors/green";
import FiberManualRecordIcon from "@material-ui/icons/FiberManualRecord";
import IconButton from "@material-ui/core/IconButton";
import red from "@material-ui/core/colors/red";
import blue from "@material-ui/core/colors/blue";

/**
 * A form which allows the editing of a todo item.
 */
class TodoDetailsForm extends React.Component {

    /**
     * Creates the form.
     * 
     * If the form has been supplied with a todo item as a prop, the form will be initialized with the values
     * in that todo item. Otherwise, it will be initialized with a new item with default values.
     */
    constructor(props) {
        super(props);
        const todo = props.todo ? { ...props.todo } : {
            title: '',
            description: '',
            created: new Date(),
            modified: new Date(),
            due: moment().add(1, 'days').toDate(),
            isComplete: false,
            priority: 'Medium'
        };

        this.state = { todo, errorShown: false };
    }

    /**
     * Called when the user modifies the values in any of the form fields. Updates the todo item to match.
     * 
     * @param changes the changes to apply to the todo item
     */
    handleChange(changes) {
        this.setState(oldState => ({
            todo: { ...oldState.todo, ...changes }
        }));
    }

    /**
     * Called when the user presses the "cancel" button. Forwards the cancel on to the parent via props.
     */
    handleCancel() {
        const { onCancel } = this.props;
        onCancel && onCancel();
    }

    /**
     * Called when the user presses the "ok" button. If all form fields are valid, forwards this on to the
     * parent via props. Otherwise, displays an error message to the user.
     */
    handleOk() {
        const { todo } = this.state;
        if (!todo.title) {
            this.setErrorDialogShown(true);
        }
        else {
            const { onOk } = this.props;
            onOk && onOk(this.state.todo);
        }
    }

    /**
     * Sets up this component to either show or hide the error dialog.
     * 
     * @param isShown true if an error message should be shown, false otherwise
     */
    setErrorDialogShown(isShown) {
        this.setState(oldState => ({
            errorShown: isShown
        }));
    }

    /**
     * Renders the form, including fields for title, due date, priority, description, and isComplete.
     * 
     * Also renders an OK and Cancel button. Finally, if an error should be displayed, a dialog box with that error is rendered.
     */
    render() {

        const { classes } = this.props;
        const { todo, errorShown } = this.state;

        return (
            <>
                <div className={classes.root}>
                    <Grid container spacing={2}>

                        <Grid item xs={12}>
                            <TextField
                                variant="outlined"
                                required
                                error={!todo.title}
                                helperText={!todo.title && 'A title is required'}
                                label="Title"
                                placeholder="What do you have to do?"
                                value={todo.title}
                                onChange={event => this.handleChange({ title: event.target.value })}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <DateTimePicker
                                label="Due date"
                                ampm={false}
                                showTodayButton
                                inputVariant="outlined"
                                value={todo.due}
                                onChange={date => this.handleChange({ due: date.toDate() })}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <FormControl variant="outlined">
                                <InputLabel id="todo-priority-label">Priority</InputLabel>
                                <Select
                                    labelId="todo-priority-label"
                                    id="todo-priority-select"
                                    value={todo.priority}
                                    onChange={event => this.handleChange({ priority: event.target.value })}
                                    label="Priority"
                                >
                                    <MenuItem value="Low">Low</MenuItem>
                                    <MenuItem value="Medium">Medium</MenuItem>
                                    <MenuItem value="High">High</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                variant="outlined"
                                multiline
                                rows={2}
                                label="Description"
                                placeholder="Enter any additional info you'd like to save here."
                                value={todo.description}
                                onChange={event => this.handleChange({ description: event.target.value })}
                            />
                        </Grid>
                        <Grid item xs={12} sm={2}>
                            <FormControl>
                                <InputLabel id="todo-color-label">Color</InputLabel>
                                <Select
                                    labelId="todo-color-label"
                                    id="todo-color-select"
                                    value={todo.color ? todo.color : 'Red'}
                                    onChange={event => this.handleChange({ color: event.target.value })}
                                    label="Color"
                                >
                                    <MenuItem value="Red"><FiberManualRecordIcon style={{ color: red[500] }}/></MenuItem>
                                    <MenuItem value="Green"><FiberManualRecordIcon style={{ color: green[500] }}/></MenuItem>
                                    <MenuItem value="Blue"><FiberManualRecordIcon style={{ color: blue[500] }}/></MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={8}>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={todo.isComplete}
                                        onChange={event => this.handleChange({ isComplete: event.target.checked })}
                                        color="primary"
                                    />
                                }
                                label="Has this item been completed?"
                            />
                        </Grid>
                        <Grid item xs={12} sm={12} className={classes.buttonPanel}>
                            <span style={{ flexGrow: 1 }} />
                            <Button color="secondary" onClick={() => this.handleCancel()}>Cancel</Button>
                            <Button color="primary" onClick={() => this.handleOk()}>OK</Button>
                        </Grid>
                    </Grid>
                </div>
                <TitleRequiredDialog open={errorShown} onClose={() => this.setErrorDialogShown(false)} />
            </>
        );
    }
}

/**
 * Styles to apply to the form
 */
const styles = theme => ({
    root: {
        margin: theme.spacing(2),
        flexGrow: 1,

        '& .MuiGrid-item': {
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'flex-start',
            alignItems: 'stretch'
        },
        '& .MuiGrid-item > *': {
            flexGrow: 1
        },
        '& .MuiGrid-item > .MuiButton-root': {
            flexGrow: 0,
            marginLeft: theme.spacing(1)
        }
    }
});

/**
 * A dialog box that displays an error message to the user, to prompt them to correct their data entry.
 */
function TitleRequiredDialog({ open, onClose }) {
    return (
        <Dialog
            open={open !== undefined ? open : true}
            onClose={onClose}
            aria-labelledby="title-required-dialog-title"
            aria-describedby="title-required-dialog-description"
        >
            <DialogTitle id="title-required-dialog-title">A title is required!</DialogTitle>
            <DialogContent>
                <DialogContentText id="title-required-dialog-description">
                    You need to give your to-do item a title, so you know what you need to do!
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="primary" autoFocus>OK</Button>
            </DialogActions>
        </Dialog>
    );
}

export default withStyles(styles)(TodoDetailsForm);