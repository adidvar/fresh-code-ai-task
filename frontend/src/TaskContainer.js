import React, { useState, useEffect } from 'react';
import Task from './Task.js'
import NewTask from './NewTask.js'
import './TaskContainer.css'

function TaskContainer() {
  const [data, setData] = useState(null); 
  const [error, setError] = useState(null); 
  const [loading, setLoading] = useState(true); 
  const [updater, setUpdater] = useState(0); 

  useEffect(() => {
    fetch('http://127.0.0.1:2121/todos') 
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json(); 
      })
      .then((data) => {
        setData(data); 
        setLoading(false); 
      })
      .catch((error) => {
        setError(error);
        setLoading(false); 
      });
  },[updater]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className='task-container'>
      {data.map((item) => <Task key={item.id} data={item}  updater={updater} setUpdater={setUpdater}/>)}
      <NewTask updater={updater} setUpdater={setUpdater}/>
    </div>
  );
}

export default TaskContainer;
