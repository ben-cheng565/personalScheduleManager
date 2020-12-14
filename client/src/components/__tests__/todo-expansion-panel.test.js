import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import TodoExpansionPanel from '../todo-expansion-panel';
import moment from 'moment';

let threeMonthsAgo, oneMonthAgo, oneMonthFromNow;

let todoOverdue, todoIncomplete, todoComplete;

beforeEach(() => {

    threeMonthsAgo = moment().subtract(3, 'months');
    oneMonthAgo = moment().subtract(1, 'month');
    oneMonthFromNow = moment().add(1, 'month');

    todoOverdue = {
        title: 'Overdue item',
        description: 'Overdue description',
        created: threeMonthsAgo.toDate(),
        modified: threeMonthsAgo.toDate(),
        due: oneMonthAgo.toDate(),
        isComplete: false,
        priority: 'High'
    };

    todoIncomplete = {
        title: 'Incomplete item',
        description: 'Incomplete description',
        created: threeMonthsAgo.toDate(),
        modified: threeMonthsAgo.toDate(),
        due: oneMonthFromNow.toDate(),
        isComplete: false,
        priority: 'Medium'
    };

    todoComplete = {
        title: 'Complete item',
        description: 'Complete description',
        created: threeMonthsAgo.toDate(),
        modified: threeMonthsAgo.toDate(),
        due: oneMonthAgo.toDate(),
        isComplete: true,
        priority: 'Low'
    };
})


it('displays the correct data with overdue item', () => {
    const { container } = render(<TodoExpansionPanel expanded={false} todo={todoOverdue} />);

    // Make sure items with these text are on-screen
    screen.getByText('Overdue item');
    screen.getByText('Overdue description');
    screen.getByText('High priority');
    screen.getByText(threeMonthsAgo.calendar());
    screen.getByText(`Overdue! Was due ${oneMonthAgo.fromNow()}`);
    
    expect(screen.queryByText('Due in')).toBeNull();
    expect(screen.queryByText('Done!')).toBeNull();
});

it('displays the correct data with incomplete item', () => {
    const { container } = render(<TodoExpansionPanel expanded={false} todo={todoIncomplete} />);

    // Make sure items with these text are on-screen
    screen.getByText('Incomplete item');
    screen.getByText('Incomplete description');
    screen.getByText('Medium priority');
    screen.getByText(threeMonthsAgo.calendar());
    screen.getByText(`Due ${oneMonthFromNow.fromNow()}`);

    expect(screen.queryByText('Overdue!')).toBeNull();
    expect(screen.queryByText('Done!')).toBeNull();
});

it('displays the correct data with complete item', () => {
    const { container } = render(<TodoExpansionPanel expanded={false} todo={todoComplete} />);

    // Make sure items with these text are on-screen
    screen.getByText('Complete item');
    screen.getByText('Complete description');
    screen.getByText('Low priority');
    screen.getByText(threeMonthsAgo.calendar());
    screen.getByText(`Done!`);

    expect(screen.queryByText('Due in')).toBeNull();
    expect(screen.queryByText('Overdue!')).toBeNull();
});


it('trigger the correct event when edit button is clicked', () => {
    const { container } = render(<TodoExpansionPanel expanded={false} todo={todoComplete} />);

    //
    const button = screen.getByTitle("Edit");
    fireEvent.click(button);


});

it('trigger the correct event when toggle complete button is clicked', () => {
    const { container } = render(<TodoExpansionPanel expanded={false} todo={todoComplete} />);

    //
    const button = screen.getByTitle("Mark as incomplete");
    fireEvent.click(button);


});

it('trigger the correct event when delete button is clicked', () => {
    const { container } = render(<TodoExpansionPanel expanded={false} todo={todoComplete} />);

    //
    const button = screen.getByTitle("Remove this todo");
    fireEvent.click(button);


});