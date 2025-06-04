import React, { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [todos, setTodos] = useState([]);
  const [studentId, setStudentId] = useState('');
  const [tutorId, setTutorId] = useState('');
  const [subject, setSubject] = useState('');
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const response = await fetch('http://localhost:5000/data');
      const data = await response.json();
      setTodos(data);
    } catch (err) {
      console.error('Error fetching todos:', err);
    }
  };

  const createTodo = async () => {
    try {
      await fetch('http://localhost:5000/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          student_id: parseInt(studentId),
          tutor_id: parseInt(tutorId),
          subject
        }),
      });
      fetchTodos();
      resetForm();
    } catch (err) {
      console.error('Error creating todo:', err);
    }
  };

  const updateTodo = async () => {
    try {
      await fetch(`http://localhost:5000/data/${editId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          student_id: parseInt(studentId),
          tutor_id: parseInt(tutorId),
          subject
        }),
      });
      fetchTodos();
      resetForm();
    } catch (err) {
      console.error('Error updating todo:', err);
    }
  };

  const deleteTodo = async (id) => {
    try {
      await fetch(`http://localhost:5000/data/${id}`, {
        method: 'DELETE',
      });
      fetchTodos();
    } catch (err) {
      console.error('Error deleting todo:', err);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    editId ? updateTodo() : createTodo();
  };

  const handleEdit = (todo) => {
    setStudentId(todo.student_id);
    setTutorId(todo.tutor_id);
    setSubject(todo.subject);
    setEditId(todo._id);
  };

  const resetForm = () => {
    setStudentId('');
    setTutorId('');
    setSubject('');
    setEditId(null);
  };

  return (
    <div style={{ textAlign: 'center' }}>
      <div className='Hi'>
        <h1>TODO APP</h1>
      </div>
      <form onSubmit={handleSubmit}>
        <input
          type="number"
          placeholder='Student ID'
          value={studentId}
          onChange={(e) => setStudentId(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder='Tutor ID'
          value={tutorId}
          onChange={(e) => setTutorId(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder='Subject'
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          required
        />
        <button type="submit">{editId ? 'Update' : 'Add'}</button>
      </form>

      <ul>
        {todos.map((todo) => (
          <li key={todo._id}>
            <strong>Student ID:</strong> {todo.student_id}, <strong>Tutor ID:</strong> {todo.tutor_id}, <strong>Subject:</strong> {todo.subject}
            <button onClick={() => handleEdit(todo)}>Edit</button>
            <button onClick={() => deleteTodo(todo._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
