
import React, { Component } from 'react';
import './Task.css'

function Task(props) {

  async function onDelete() {
    try {
      const response = await fetch(`http://127.0.0.1:2121/todos/${props.data.id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      await response.json();
      props.setUpdater(props.updater + 1);
    } catch (error) {
      console.error('Error posting data:', error);
    }
  }

  async function onSwitch() {
    try {
      const response = await fetch(`http://127.0.0.1:2121/todos/${props.data.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: props.data.text,
          color: props.data.color,
          group_name: props.data.group_name === "виконується" ? "виконано" : "виконується",
          order_index: props.data.order_index
        })
      })
      await response.json();
      props.setUpdater(props.updater + 1);
    } catch (error) {
      console.error('Error posting data:', error);
    }
  }



  return (
    <div className='task' style={{ background: props.data.color }}>
      <p className='task__text'> {props.data.text} </p>
      <div className='task__controls'>
        <label> {props.data.group_name} </label>
        <button className='switch-button' onClick={onSwitch}> {props.data.group_name === "виконується" ? "Виконати" : "Скасувати"} </button>
        <button className='delete-button' onClick={onDelete}> Видалити </button>
      </div>
    </div>
  );
}

export default Task;