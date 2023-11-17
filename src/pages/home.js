// KanbanBoard.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router'
import Add from "../assets/svg/add.svg";
import Delete from "../assets/svg/delete.svg"
import Edit from "../assets/svg/edit.svg"
import AddColumn from '../components/modals/AddColumn';
import Sort from "../assets/svg/sort.svg"
import { useMutation } from '@apollo/client';
import AddTask from '../components/modals/AddTask';
import { CREATE_TASK, UPDATE_TASK, DELETE_TASK, CREATE_COLUMN, UPDATE_COLUMN, DELETE_COLUMN,GET_TASKS_AND_COLUMNS } from '../gql/mutations';
import { useQuery } from '@apollo/client';

import { format } from 'date-fns';
import Text from "../assets/text.json"


const KanbanBoard = () => {
  const { loading, error, data } = useQuery(GET_TASKS_AND_COLUMNS, {
    fetchPolicy: 'cache-and-network',
  })
  const [tasks, setTasks] = useState(data?.allTasks || []);
  const [columns, setColumns] = useState([]);
  const navigate = useNavigate()
  const [selectedColumn, setSelectedColumn] = useState({});
  const [selectedTask, setSelectedTask] = useState({});
  const [sortOrder, setSortOrder] = useState('asc');
  const [isEdit, setIsEdit] = useState(false);
  const [createTaskMutation] = useMutation(CREATE_TASK);
  const [updateTaskMutation] = useMutation(UPDATE_TASK);
  const [deleteTaskMutation] = useMutation(DELETE_TASK);
  const [createColumnMutation] = useMutation(CREATE_COLUMN);
  const [updateColumnMutation] = useMutation(UPDATE_COLUMN);
  const [deleteColumnMutation] = useMutation(DELETE_COLUMN);
  const [sortedColumnId, setSortedColumnId] = useState(null);

  useEffect(() => {
    setTasks(data?.allTasks)
    const allColumns = data?.allColumns?.map((val) => {
      return {
        ...val, tasks: data?.allTasks?.filter((task) => task?.category?.id === val.id)
      }
    })

    setColumns(allColumns)

  }, [data?.allTasks])
  const currentDate = new Date();
  const isoDateString = currentDate.toISOString();
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const handleDragStart = (e, id) => {
    e.dataTransfer.setData('text/plain', id);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = async (e, targetColumnId) => {
    const droppedTaskId = e.dataTransfer.getData('text/plain');


    // Execute the UPDATE_TASK mutation to update the task's columnId
    try {
      await updateTaskMutation({
        variables: {
          id: droppedTaskId,
          categoryId: targetColumnId,
        },
        refetchQueries: [{ query: GET_TASKS_AND_COLUMNS }],
      });

    } catch (error) {
      console.error('Error updating task:', error);
    }

    navigate(0);
  };



  const handleAddColumn = async (val) => {
    const formattedDate = format(new Date(), 'yyyy-MM-dd HH:mm:ss');

    try {
      // Execute the mutation
      const result = await createColumnMutation({
        variables: {
          name: val,
          date: isoDateString, // Convert date to ISO string
        },
        refetchQueries: [{ query: GET_TASKS_AND_COLUMNS }],
      });

      // Handle the result as needed
      console.log('Column created:', result.data.createColumn.column);
    } catch (error) {
      console.error('Error creating column:', error);
    }
    setSelectedColumn({});
    document.getElementById('my_modal_3').close();

    navigate(0);
  };

  const handleDeleteColumn = async (id) => {
    try {
      // Execute the mutation
      await deleteColumnMutation({
        variables: {
          id,
        },
        refetchQueries: [{ query: GET_TASKS_AND_COLUMNS }],
      });
      // Optionally, you can handle any additional logic after the mutation is completed
    } catch (error) {
      console.error('Error deleting column:', error);
    }
    navigate(0);
  };

  const handleUpdateColumn = async (newName) => {
    try {
      // Execute the mutation
      const result = await updateColumnMutation({
        variables: {
          id: selectedColumn?.id,
          name: newName,
          date: isoDateString, // Convert date to ISO string
        },
        refetchQueries: [{ query: GET_TASKS_AND_COLUMNS }],
      });

      // Handle the result as needed
      console.log('Column updated:', result.data.updateColumn.column);
    } catch (error) {
      console.error('Error updating column:', error);
    }
    navigate(0);
    setSelectedColumn({});
    setIsEdit(false);
    document.getElementById('my_modal_3').close();
  };

  const handleAddTask = async (columnId, newTask) => {
    const formattedDate = format(new Date(), 'yyyy-MM-dd HH:mm:ss');
    const isoDateString = formattedDate; // Use formattedDate instead of currentDate.toISOString()

    try {
      // Execute the mutation
      const mutationVariables = {
        text: newTask?.title,
        description: newTask?.description,
        categoryId: columnId,
        // Only include the date if newTask has a date property
        date: newTask?.date ? newTask.date : isoDateString,
      };

      await createTaskMutation({
        variables: mutationVariables,
        refetchQueries: [{ query: GET_TASKS_AND_COLUMNS }],
      });

      // Optionally, you can handle any additional logic after the mutation is completed
    } catch (error) {
      console.error('Error creating task:', error);
    }

    setSelectedTask({});
    document.getElementById('my_modal_4').close();
    navigate(0);
  };
  const handleRemoveTask = async (taskId) => {
    try {
      // Execute the mutation
      await deleteTaskMutation({
        variables: {
          id: taskId,
        },
        refetchQueries: [{ query: GET_TASKS_AND_COLUMNS }],
      });
      // Optionally, you can handle any additional logic after the mutation is completed
    } catch (error) {
      console.error('Error deleting task:', error);
    }
    navigate(0);
  };

  const handleUpdateTask = async (newTask) => {
    try {
      // Execute the mutation
      await updateTaskMutation({
        variables: {
          id: selectedTask?.id,
          text: newTask?.title,
          description: newTask?.description,
          date: isoDateString, // Convert date to ISO string
        },
        refetchQueries: [{ query: GET_TASKS_AND_COLUMNS }],
      });
    } catch (error) {
      console.error('Error updating task:', error);
    }
    setSelectedTask({});
    setIsEdit(false);
    document.getElementById('my_modal_4').close();

    navigate(0)
  };

  const handleModalOpen = (val) => {
    console.log(val);
    document.getElementById('my_modal_4').showModal();
    setSelectedTask(val);
    setIsEdit(true);
  };

  const handleModalOpenColumn = (val) => {
    document.getElementById('my_modal_3').showModal();
    setSelectedColumn(val);
    setIsEdit(true);
  };
  const sortItemsBy = (columnId) => {
    const updatedColumns = columns?.map((column) => {
      if (column.id === columnId) {
        const sortedTasks = [...column.tasks];
        sortedTasks.sort((a, b) => {
          // Assuming tasks are strings
          const taskA = a?.text?.toLowerCase(); // Convert to lowercase for case-insensitive sorting
          const taskB = b?.text?.toLowerCase();

          return sortOrder === 'asc' ? taskA.localeCompare(taskB) : taskB.localeCompare(taskA);
        });

        return {
          ...column,
          tasks: sortedTasks,
        };
      }
      return column;
    });

    // Update the state with sorted tasks for the selected column
    setColumns(updatedColumns);
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    setSortedColumnId(columnId); // Update the sorted column ID

  };

  return (
    <div className='h-screen overflow-hidden  bg-black'>
      <div className="flex justify-start w-full h-full py-12 px-12  overflow-x-auto">

        <div className="flex items-start">
          {columns?.map((val) => (
            <div
              key={val.id}
              className="w-72 rounded-xl mr-4 bg-[#161C21]  relative h-3/4 overflow-auto"
              onDragOver={(e) => handleDragOver(e)}
              onDrop={(e) => handleDrop(e, val.id)}
            >
              {console.log(columns?.tasks, "task")}
              <div className='flex justify-between items-center mb-4 bg-[rgb(14,17,23)] py-3 px-3 '>
                <h2 className="text-lg font-semibold capitalize text-white rounded-lg">
                  {val.name}
                </h2>
                <div className='flex items-center space-x-2'>
                  <img src={Edit} alt='edit' className='w-6 cursor-pointer' onClick={() => handleModalOpenColumn(val)} />

                  <img src={Delete} alt='delete' className='w-6 cursor-pointer' onClick={() => handleDeleteColumn(val.id)} />

                </div>
              </div>
              {val?.tasks?.length > 1 ? <div className='flex justify-end pb-2'>
                <img src={Sort} className={`w-8 cursor-pointer ${sortOrder === 'asc' && sortedColumnId === val.id ? 'rotate-180' : ''}`} onClick={() => sortItemsBy(val?.id)} />
              </div> : null}
              <div className='px-2 space-y-2'>
                {val?.tasks
                  ?.map((task) => (
                    <div
                      key={task.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, task.id)}
                      className="bg-[rgb(14,17,23)] p-2 mb-2 hover:border border-red-500 rounded-lg cursor-pointer"
                    >
                      <div className='flex items-center justify-between'>
                        <p className='text-white'>{task.text}</p>
                        <div className='flex items-center space-x-2'>
                          <img src={Edit} alt='edit' className='w-6 cursor-pointer' onClick={() => handleModalOpen(task)} />

                          <img src={Delete} alt='delete' className='w-6 cursor-pointer' onClick={() => handleRemoveTask(task.id)} />

                        </div>
                      </div>
                      <p className='max-h-32 overflow-scroll'>
                        {task?.description}
                      </p>
                    </div>
                  ))}
              </div>
              <div className='py-3 px-3 bg-[rgb(14,17,23)] absolute bottom-0 w-full hover:border border-red-500 flex items-center space-x-3 cursor-pointer' onClick={() => {
                document.getElementById('my_modal_4').showModal()
                setSelectedColumn(val)
              }}>
                <img src={Add} alt='add' className='w-6' />
                <p className='text-white'>
                  {Text?.addTask}
                </p>
              </div>
              <AddTask id={val.id} handleClick={(newVal) => handleAddTask(selectedColumn?.id, newVal)} handleUpdate={(newTask) => handleUpdateTask(newTask)} isEdit={isEdit} newVal={selectedTask} />

            </div>
          ))}

          <AddColumn handleClick={handleAddColumn} newVal={selectedColumn} isEdit={isEdit} handleUpdate={(name) => handleUpdateColumn(name)} />
        </div>
      </div>
    </div>
  );
};

export default KanbanBoard;
