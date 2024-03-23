import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../css/TasksPage.css'; // Import CSS file for styling
import editIcon from '../context/edit-icon.png';
import deleteIcon from '../context/delete-icon-open.png';

const TasksPage = ({ accessToken, onLogout, onEditTask }) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    completed: false,
  });

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get('http://localhost:8000/tasks/', {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setTasks(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching tasks:', error);
        setLoading(false);
      }
    };

    fetchTasks();
  }, [accessToken]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8000/tasks/', formData, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      setTasks([...tasks, response.data]);
      setFormData({ title: '', description: '', completed: false });
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

  const taskss = [
    {
      id: 1,
      title: 'Task 1',
      description: 'Description for Task 1',
      completed: true
    },
    {
      id: 2,
      title: 'Task 2',
      description: 'Description for Task 2',
      completed: false
    },
    {
      id: 3,
      title: 'Task 3',
      description: 'Description for Task 3',
      completed: true
    }
  ];

  const handleEditTask = async (taskId) => {
    onEditTask(taskId)
  }

  const handleDeleteTask = async (taskId) => {
    try {
      await axios.delete(`http://localhost:8000/tasks/${taskId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      setTasks(tasks.filter(task => task.id !== taskId));
      console.log("Task deleted successfully:", taskId);
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  }

  return (
    <div>
      <button className="logout-button" onClick={onLogout}>Logout</button>
      <div className="tasks-container">
        <h2>Tasks</h2>
        <form onSubmit={handleSubmit} className="task-form">
          <input type="text" name="title" value={formData.title} onChange={handleInputChange} placeholder="Title" required />
          <input type="text" name="description" value={formData.description} onChange={handleInputChange} placeholder="Description" required />
          <input type="text" name="completed" value={formData.completed} onChange={handleInputChange} placeholder="Completed" required />
          <button type="submit">Add Task</button>
        </form>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <ul className="task-list">
            {taskss && taskss.map((task) => (
              <li key={task.id} className="task-item">
                <strong>{task.title}</strong> - {task.description} - Completed: {task.completed ? 'Yes' : 'No'}
                <div>
                <img src={editIcon} alt="Edit" onClick={() => handleEditTask(task.id)} className="edit-icon" />
                <img src={deleteIcon} alt="Delete" onClick={() => handleDeleteTask(task.id)} className="edit-icon" />
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default TasksPage;
// onClick={() => handleEditTask(task.id)}