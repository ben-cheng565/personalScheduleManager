import React from 'react';

import TodoExpansionPanel from './todo-expansion-panel';

/**
 * A component which displays a list of todo items given in props. This component maintains internal state determining
 * which todo item is currently selected / expanded.
 */
class ToDoList extends React.Component {

    /**
     * Initializes blank "expanded" state
     */
    constructor(props) {
        super(props);
        this.state = {}
    }

    /**
     * The current panel's expanded status will be set to false. Then, if the new panel is different from the current panel,
     * the new panel's expanded status will be set to true.
     */
    handleChange(panel) {
        this.setState(oldState => ({
            expanded: oldState.expanded !== panel && panel
        }));
    }

    /**
     * Renders a single TodoExpansionPanel for each todo item in props. At most one will be expanded at any given time
     * (controlled by state changes)
     */
    render() {
        const { expanded } = this.state;
        const { todos, onToggleCompleteClick, onDeleteClick, onEditClick } = this.props;

        return (
            <div>
                {todos && todos.map((todo, index) => (
                    <TodoExpansionPanel
                        key={index}
                        todo={todo}
                        expanded={expanded === todo._id}
                        onExpandChanged={panel => this.handleChange(panel)}
                        onEditClick={onEditClick}
                        onDeleteClick={onDeleteClick}
                        onDoneClick={onToggleCompleteClick} />
                ))}
            </div>
        );
    }
}

export default ToDoList;