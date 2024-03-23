import React, { useState } from 'react';
import editIcon from '../context/edit-icon.png';

const EditTask = ({ task, onSave, onCancel }) => {
  const [editedTask, setEditedTask] = useState({ ...task });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedTask({ ...editedTask, [name]: value });
  };

  const handleSave = () => {
    onSave(editedTask);
  };

  return (
    <div className="edit-modal">
      <h3>Edit Task</h3>
      <input
        type="text"
        name="title"
        value={editedTask.title}
        onChange={handleInputChange}
        placeholder="Title"
        required
      />
      <input
        type="text"
        name="description"
        value={editedTask.description}
        onChange={handleInputChange}
        placeholder="Description"
        required
      />
      <input
        type="checkbox"
        name="completed"
        checked={editedTask.completed}
        onChange={handleInputChange}
      />
      <label>Completed</label>
      <button onClick={handleSave}>Save</button>
      <button onClick={onCancel}>Cancel</button>
    </div>
  );
};

const TaskItem = ({ task, onEdit, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSaveEdit = (editedTask) => {
    // Call the parent function to save the edited task
    onEdit(editedTask);
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  return (
    <li className="task-item">
      <strong>{task.title}</strong> - {task.description} - Completed: {task.completed ? 'Yes' : 'No'}
      <div>
        <img src={editIcon} alt="Edit" onClick={handleEdit} className="edit-icon" />
        <button onClick={() => onDelete(task.id)}>Delete</button>
      </div>
      {isEditing && (
        <EditTask
          task={task}
          onSave={handleSaveEdit}
          onCancel={handleCancelEdit}
        />
      )}
    </li>
  );
};

export default TaskItem;
