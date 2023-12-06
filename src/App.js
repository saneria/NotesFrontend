import React, { useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import AddNote from './components/AddNote';
import Sidebar from './components/Sidebar';
import Notes from './components/Notes';

const App = () => {
  const [notes, setNotes] = useState([]);

  const handleAddNote = (newNote) => {
    setNotes([...notes, newNote]);
  };

  return (
    <div>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/addnote"
          element={<AddNote onAddNote={handleAddNote} />}
        />
        <Route path="/sidebar" element={<Sidebar notes={notes} />} />
        <Route path="/viewnote" element={<Notes />} />



   
      </Routes>
    </div>
  );
};

export default App;
