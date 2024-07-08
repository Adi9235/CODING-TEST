import logo from './logo.svg';
import './App.css';

import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/employees')
      .then(response => setEmployees(response.data))
      .catch(error => console.error(error));
  }, []);

  const deleteEmployee = (id) => {
    axios.delete(`http://localhost:5000/employee/${id}`)
      .then(() => setEmployees(employees.filter(emp => emp.EmployeeId !== id)))
      .catch(error => console.error(error));
  };

  return (
    <div>
      <h1>Employee List</h1>
      <Link to="/add">Add Employee</Link>
      <ul>
        {employees.map(emp => (
          <li key={emp.EmployeeId}>
            {emp.FirstName} {emp.LastName} - {emp.Position}
            <Link to={`/edit/${emp.EmployeeId}`}>Edit</Link>
            <button onClick={() => deleteEmployee(emp.EmployeeId)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

const EmployeeForm = () => {
  const [employee, setEmployee] = useState({ FirstName: '', LastName: '', Email: '', Position: '' });
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    if (id) {
      axios.get(`http://localhost:5000/employee/${id}`)
        .then(response => setEmployee(response.data))
        .catch(error => console.error(error));
    }
  }, [id]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (id) {
      axios.put(`http://localhost:5000/employee/${id}`, employee)
        .then(() => navigate('/'))
        .catch(error => console.error(error));
    } else {
      axios.post('http://localhost:5000/employee', employee)
        .then(() => navigate('/'))
        .catch(error => console.error(error));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEmployee({ ...employee, [name]: value });
  };

  return (
    <div>
      <h1>{id ? 'Edit' : 'Add'} Employee</h1>
      <form onSubmit={handleSubmit}>
        <input type="text" name="FirstName" value={employee.FirstName} onChange={handleChange} placeholder="First Name" required />
        <input type="text" name="LastName" value={employee.LastName} onChange={handleChange} placeholder="Last Name" required />
        <input type="email" name="Email" value={employee.Email} onChange={handleChange} placeholder="Email" required />
        <input type="text" name="Position" value={employee.Position} onChange={handleChange} placeholder="Position" required />
        <button type="submit">{id ? 'Update' : 'Add'} Employee</button>
      </form>
    </div>
  );
};

function App() {
  return (
    <Router>
      <div className="App">
        <nav>
          <ul>
            <li>
              <Link to="/">Employee List</Link>
            </li>
            <li>
              <Link to="/add">Add Employee</Link>
            </li>
          </ul>
        </nav>
        <Routes>
          <Route path="/" element={<EmployeeList />} />
          <Route path="/add" element={<EmployeeForm />} />
          <Route path="/edit/:id" element={<EmployeeForm />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
