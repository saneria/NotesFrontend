import React, { useState } from "react";
import { jsPDF } from "jspdf";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";

const AddNote = () => {
  const [notes, setNotes] = useState("");
  const [notes_title, setTitle] = useState("");
  const user_id = localStorage.getItem("data");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  
  

  const handleAddNote = async () => {
    setLoading(true);

    try {
      const response = await fetch("http://appnote.test/api/notes", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id,
          notes_title,
          notes,
        }),
      });

      const data = await response.json();
      console.log(data);
  
      if (response.ok) {
        alert("Note added successfully!");
      } else {
        alert(`Failed to add note: ${data.message}`);
      }

      
    } catch (error) {
      console.error("Error adding note:", error.message);
      alert("An error occurred while adding the note");
    } finally {
      setLoading(false);
    }

    
  };

  const handleSavePDF = () => {
    const pdf = new jsPDF();
    pdf.text(`Title: ${notes_title}\n\n${notes}`, 10, 10);
    pdf.save(`${notes_title}.pdf`);
  };

  const handleLogout = () => {
    localStorage.removeItem("data");
    navigate("/");
  };

  const handleViewNote = () => {
    navigate("/viewnote");
  };

  return (
    <div>
      <h2>Add Note</h2>
      <input
        type="text"
        placeholder="Enter note title"
        value={notes_title}
        onChange={(e) => setTitle(e.target.value)}
        disabled={loading}
      />
      <br />
      <textarea
        rows="4"
        cols="50"
        placeholder="Enter your note"
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        disabled={loading}
      ></textarea>
      <br />
      <button onClick={handleAddNote} disabled={loading}>
        {loading ? "Adding..." : "Add Note"}
      </button>
      <br />
      <Sidebar notes={notes} />
      <button onClick={handleSavePDF} disabled={loading}>
        Save as PDF
      </button>
      <button onClick={handleViewNote} disabled={loading}>
        View Note
      </button>
      <br />
      <button onClick={handleLogout}>Logout</button>
      <br />
    </div>
  );
};

export default AddNote;


// try {
//   const response = await fetch("http://appraisal.test/api/dealertransaction", {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//       "Accept": "application/json",
//     },
//     body: JSON.stringify({
//       dealer_name,
//       car_name,
//       location,
//       price,
//       vin,
//     }),
//   });
// appraisal.test
// amant 🤍
// Marc Gerasmio
// or kani
// amant 🤍
// Marc Gerasmio
// const validateUser = async () => {
// const response = await fetch('http://appraisal.test/api/userlogin', {
//   method: "POST",
//   headers: {
//     'Content-Type': 'application/json'
//   },
//   body: JSON.stringify({
//     email,
//     password
//   })
// });

// const validateUser = async () => {
//   const response = await fetch('http://appraisal.test/api/userlogin', {
//     method: "POST",
//     headers: {
//       'Content-Type': 'application/json'
//     },
//     body: JSON.stringify({
//       email,
//       password
//     })
//   });

//   const data = await response.json();