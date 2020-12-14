import { Todo } from './schema';
import moment from 'moment';

const DUMMY_TODOS = [
    {
        title: 'Procrastinate',
        description: 'Do anything other than what I\'m supposed to be doing.',
        priority: 'High',
        created: moment().toDate(),
        modified: moment().toDate(),
        due: moment().add(2, 'days').toDate(),
        isComplete: false,
        color: 'Red'
    },
    {
        title: 'Write CS732/SE750 assignment',
        description: 'Give the students the most challenging assignment they\'ve ever had in their lives.',
        priority: 'Medium',
        created: moment().subtract(7, 'days').toDate(),
        modified: moment().toDate(),
        due: moment().add(5, 'days').toDate(),
        isComplete: false,
        color: 'Red'
    },
    {
        title: 'Finish CS732/SE750 lectures',
        description: 'Finish preparing lecture material',
        priority: 'High',
        created: moment().subtract(1, 'months').toDate(),
        modified: moment().toDate(),
        due: moment().toDate(),
        isComplete: true,
        color: 'Green'
    },
    {
        title: 'Binge Clone Wars on Netflix',
        description: 'Watch the final series of this epic cartoon',
        priority: 'Low',
        created: moment().toDate(),
        modified: moment().toDate(),
        due: moment().add(2, 'months').toDate(),
        isComplete: false,
        color: 'Green'
    },
    {
        title: 'Order food',
        description: 'Now that level 4 is over, I don\'t have to cook for myself all the time!',
        priority: 'High',
        created: moment('2020-04-28').toDate(),
        modified: moment('2020-04-30').toDate(),
        due: moment('2020-04-30').toDate(),
        isComplete: true,
        color: 'Blue'
    }
];

/**
 * Deletes all todo items in the database, then adds all todo items in the above array ^
 */
export default async function () {

    await Todo.deleteMany({});
    await Todo.create(DUMMY_TODOS.map(data => new Todo(data)));

}