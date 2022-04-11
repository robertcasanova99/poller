import React from 'react';

import './App.css';
import { Routes, Route } from "react-router-dom"
import { Login } from './pages/Login/Login';
import Admin from './pages/Admin/Admin';
import Student from './pages/Student/Student';
function App() {
  return <Routes>
    <Route path="/" element={<Login />} />
    <Route path="/admin" element={<Admin />} />
    <Route path="/student" element={<Student />} />
  </Routes>
}

export default App;
