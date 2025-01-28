import React, { Component } from 'react';
import './NewTask.css'

class NewTask extends Component {
  constructor(props) {
    super(props);
    this.state = {
      inputData: '',
      responseData: null,
    };
  }

  handleInputChange = (e) => {
    this.setState({ inputData: e.target.value });
  };

  handleClick = async () => {
    const { inputData } = this.state;
    const requestData = {
      text: inputData, 
      color: "#FFFFFF",
      group_name: "виконується",
    };

    try {
      const response = await fetch('http://127.0.0.1:2121/todos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      const result = await response.json();
      this.setState({ responseData: result }); 
      this.setState({inputData : ''});
      this.props.setUpdater(this.props.updater + 1);
    } catch (error) {
      console.error('Error posting data:', error);
    }
  };

  render() {
    const { inputData, responseData } = this.state;

    return (
      <div className="new-task">
        <textarea className='new-task__text'
          type="text"
          value={inputData} 
          onChange={this.handleInputChange} 
          placeholder="Введіть текст"
          rows='3'
        />
        <div className='new-task__controls'>
          <button className='new-task__button' onClick={this.handleClick}>Зберегти</button>
        </div>
      </div>
    );
  }
}

export default NewTask;
