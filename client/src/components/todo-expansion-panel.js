import React from 'react';

import { makeStyles } from '@material-ui/core/styles';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';

import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';

import moment from 'moment';
import green from "@material-ui/core/colors/green";
import blue from "@material-ui/core/colors/blue";
import red from "@material-ui/core/colors/red";

/**
 * This displays a single todo item in an expandable panel. The item is displayed in a different style depending on
 * whether it is complete or not, overdue or not.
 *
 * The functionality of all buttons shown (toggle complete, expand, edit, delete) is delegated to the parent component.
 */
export default function TodoExpansionPanel({ todo, expanded, onExpandChanged, onEditClick, onDeleteClick, onDoneClick }) {

    const classes = useStyles();
    const panelName = todo._id;

    return (

        <ExpansionPanel expanded={expanded} onChange={() => onExpandChanged(panelName)}>
            <ExpansionPanelSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls={`${panelName}bh-content`}
                id={`${panelName}bh-header`}
                className={classes.panelSummary}
            >
                <Typography className={classes.titleText}>{todo.title}</Typography>
                <Typography className={`${classes.priorityText} ${getPriorityClassName(todo, classes)}`}>{todo.priority} priority</Typography>
                <Typography className={`${classes.dueDateText} ${getDueDateClassName(todo, classes)}`}>{getDueDateText(todo)}</Typography>

                <ShowColor color={todo.color} />

                <IconButton
                    aria-label="done"
                    title={`Mark as ${todo.isComplete ? 'incomplete' : 'complete'}`}
                    color={todo.isComplete ? 'primary' : 'default'}
                    onClick={(event) => {
                        event.stopPropagation();
                        onDoneClick && onDoneClick(todo);
                    }}><CheckCircleIcon /></IconButton>

                <IconButton
                    aria-label="edit"
                    title="Edit"
                    color="primary"
                    onClick={(event) => {
                        event.stopPropagation();
                        onEditClick && onEditClick(todo);
                    }}><EditIcon /></IconButton>

                <IconButton
                    aria-label="delete"
                    title="Remove this todo"
                    color="secondary"
                    onClick={(event) => {
                        event.stopPropagation();
                        onDeleteClick && onDeleteClick(todo);
                    }}><DeleteIcon /></IconButton>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails className={todo.isComplete ? classes.detailsPanelComplete : classes.detailsPanelIncomplete}>
                <div className={classes.datesBox}>
                    <Typography><strong>Created: </strong> {moment(todo.created).calendar()}</Typography>
                    <Typography><strong>Due: </strong> {moment(todo.due).calendar()}</Typography>
                </div>
                <Typography>{todo.description}</Typography>
            </ExpansionPanelDetails>
        </ExpansionPanel>
    );
}

/**
 * Renders a colored icon with different color prop.
 *
 * If no such color exists, the browser will render an empty <div>.
 */
function ShowColor(color) {
    switch (color.color) {
        case 'Red':
            return <div>
                <IconButton
                    aria-label="color"
                    title="Color"
                    style={{color: red[500]}}
                ><FiberManualRecordIcon/></IconButton>
            </div>;
        case 'Green':
            return <div>
                <IconButton
                    aria-label="color"
                    title="Color"
                    style={{color: green[500]}}
                ><FiberManualRecordIcon/></IconButton>
            </div>;
        case 'Blue':
            return <div>
                <IconButton
                    aria-label="color"
                    title="Color"
                    style={{color: blue[500]}}
                ><FiberManualRecordIcon/></IconButton>
            </div>;
        default:
            return <div></div>
    }

}
/**
 * Creates CSS classes used by this component
 */
const useStyles = makeStyles(theme => ({
    detailsPanelComplete: {
        flexDirection: 'column',
        color: theme.palette.text.secondary
    },
    detailsPanelIncomplete: {
        flexDirection: 'column',
        color: theme.palette.text.primary
    },
    datesBox: {
        display: 'flex',
        flexDirection: 'row',
        '& > *': {
            flexBasis: '50%'
        },
        marginBottom: '10px'
    },
    titleText: {
        alignSelf: 'center',
        fontSize: theme.typography.pxToRem(15),
        flexBasis: '33.33%',
        flexShrink: 0,
        color: theme.palette.text.primary
    },
    priorityText: {
        alignSelf: 'center',
        fontSize: theme.typography.pxToRem(15),
        flexBasis: '15%',
        flexShrink: 0
    },
    lowPriorityText: {
        color: theme.palette.text.secondary
    },
    mediumPriorityText: {
        color: theme.palette.text.primary
    },
    highPriorityText: {
        fontWeight: 'bold',
        color: theme.palette.text.primary
    },
    dueDateText: {
        alignSelf: 'center',
        fontSize: theme.typography.pxToRem(15),
        flexGrow: 1
    },
    gotTimeText: {
        color: theme.palette.text.secondary
    },
    upcomingText: {
        fontWeight: 'bold',
        color: '#D49A6A'
    },
    overdueText: {
        fontWeight: 'bold',
        color: '#D46F6A'
    }
}));

/**
 * Utility function to return sensible "due date" text depending on whether the given item is due in the past,
 * in the future, or is complete.
 */
function getDueDateText(todo) {
    if (todo.isComplete) {
        return 'Done!';
    }
    else if (isOverdue(todo)) {
        return `Overdue! Was due ${moment(todo.due).fromNow()}`;
    }
    else {
        return `Due ${moment(todo.due).fromNow()}`
    }
}

/**
 * Utility function to select the correct style to apply to the due date display based on overdue / complete status
 */
function getDueDateClassName(todo, classes) {
    if (isOverdue(todo)) {
        return classes.overdueText;
    }
    else if (!todo.isComplete && moment(todo.due).isBefore(moment().add(2, 'days'))) {
        return classes.upcomingText;
    }
    else {
        return classes.gotTimeText;
    }
}

/**
 * Utility function to select the correct style to apply to the priority display based on priority status
 */
function getPriorityClassName(todo, classes) {
    return classes[`${todo.priority.toLowerCase()}PriorityText`];
}

/**
 * Determines if a given todo item is overdue. An item is overdue if its due date is in the past and it is not complete.
 */
function isOverdue(todo) {
    return !todo.isComplete && moment(todo.due).isBefore(moment());
}