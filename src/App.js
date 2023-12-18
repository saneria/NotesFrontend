import React, { useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import AddNote from './components/AddNote';
// import Notes from './components/Notes';
import View from './components/View';
import ViewProfile from './components/ViewProfile';

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
        <Route path="/view" element={<View />} />
        <Route path="/profile" element={<ViewProfile />} />



   
      </Routes>
    </div>
  );
};

export default App;
