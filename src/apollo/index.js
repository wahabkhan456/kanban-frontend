import { makeVar } from '@apollo/client';
const tasksVar = makeVar([
    { id: 1, text: 'Task 1',description:"lorem ipsum", category: 'todo',columnId:1 },
    { id: 2, text: 'Task 2',description:"lorem ipsum", category: 'in-progress' ,columnId:2},
    { id: 3, text: 'Task 3',description:"lorem ipsum", category: 'done' ,columnId:3},
]);

const columnsVar = makeVar([
    { id: 1, name: 'todo' },
    { id: 2, name: 'in-progress' },
    { id: 3, name: 'done' },
]);
export default { tasksVar, columnsVar }