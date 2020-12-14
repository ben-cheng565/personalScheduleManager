import React from "react";
import { shallow } from 'enzyme'
import ToDoList from '../todo-list'
import TodoExpansionPanel from "../todo-expansion-panel";

it('renders the ToDoList component with an empty todo list', () => {

    const wrapper = shallow(<ToDoList />);

    // Expect the ToDoList to contain an empty div.
    const div = <div></div>;
    expect(wrapper).toContainReact(div);

});

it('renders the ToDoList component with a todo list with one item', () => {
    const todos = [{title: 'Overdue item'}, ];
    const wrapper = shallow(<ToDoList todos = { todos } />);

    // Expect the ToDoList to contain a TodoExpansionPanel with todo prop.
    expect(wrapper.find('TodoExpansionPanel').props().todo).toBe(todos[0]);

});

it('renders the ToDoList component with a todo list with more than one item', () => {
    const todos = [{title: 'item1'}, {title: 'item2'}, {title: 'item3'},];
    const wrapper = shallow(<ToDoList todos = { todos } />);

    // Expect the ToDoList to contain a TodoExpansionPanel with more than one todo props.
    expect(wrapper.find('TodoExpansionPanel').at(0).props().todo).toEqual(todos[0]);
    expect(wrapper.find('TodoExpansionPanel').at(1).props().todo).toEqual(todos[1]);
    expect(wrapper.find('TodoExpansionPanel').at(2).props().todo).toEqual(todos[2]);

});