import "./App.css";
import React, { useState } from "react";
import { Route, Routes } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import AddNote from "./components/AddNote";

function App() {
  // State to store the notes
  const [notes, setNotes] = useState([]);

  // Function to handle the addition of notes
  const handleAddNote = (newNote) => {
    // Update the notes state with the new note
    setNotes([...notes, newNote]);
  };

  return (
    <>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/addnote" element={<AddNote onAddNote={handleAddNote} />} />
      </Routes>
    </>
  );
}

export default App;
