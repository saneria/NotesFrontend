import React, { useState } from "react";
import { jsPDF } from 'jspdf';

const AddNote = () => {
  const [notes, setNote] = useState("");
  const user_id = localStorage.getItem('data');
  const [loading, setLoading] = useState(false);

  const handleAddNote = async () => {
    setLoading(true);

    const response = await fetch("http://appnote.test/api/notes", {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        notes,
        user_id,
      }),
    });

    const responseData = await response.json();
    console.log(responseData);
    alert("Note added successfully!");

    if (!response.ok) {
      alert("Failed to add note");
    }

    setLoading(false);
  };

  const handleNoteChange = (event) => {
    setNote(event.target.value);
  };

  const handleSavePDF = () => {
    const fileName = prompt("Enter a name for your PDF file (without extension):");

    if (fileName) {
      const pdf = new jsPDF();
      pdf.text(notes, 10, 10);
      pdf.save(`${fileName}.pdf`);
    }
  };

  return (
    <div>
      <h2>Add Note</h2>
      <textarea
        rows="4"
        cols="50"
        placeholder="Enter your note"
        value={notes}
        onChange={handleNoteChange}
      ></textarea>
      <br />
      <button onClick={handleAddNote} disabled={loading}>
        {loading ? "Adding..." : "Add Note"}
      </button>
      <br />
      <button onClick={handleSavePDF}>Save as PDF</button>
    </div>
  );
};

export default AddNote;
