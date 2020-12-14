import React from 'react';
import { Dialog, DialogTitle, DialogContent } from '@material-ui/core';
import TodoDetailsForm from './todo-details-form';

/**
 * Wraps a ToDoDetailsForm in a dialog box.
 */
export default function TodoDetailsDialog({ open, title, todo, onOk, onCancel }) {
    return (
        <Dialog
            open={open !== undefined ? open : true}
            onClose={onCancel}
            aria-labelledby="todo-dialog-title"
        >
            <DialogTitle id="todo-dialog-title">{title ? title : 'Edit item'}</DialogTitle>
            <DialogContent>
                <TodoDetailsForm todo={todo} onOk={onOk} onCancel={onCancel} />
            </DialogContent>
        </Dialog>
    );
}