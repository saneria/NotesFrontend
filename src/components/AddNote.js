import React, { useState } from "react";

const AddNote = ({ onAddNote }) => {
  const [note, setNote] = useState("");
  const [error, setError] = useState(null);
  var data = localStorage.getItem("data");
  console.log(data);

  const handleInputChange = (e) => {
    setNote(e.target.value);
  };

  const handleAddNote = async () => {
    try {
      if (note.trim() !== "") {
        console.log(note);

        const response = await fetch("http://appnote.test/api/notes", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(),
        });

        if (!response.ok) {
          throw new Error(`Failed to add note. Status: ${response.status}`);
        }

        const data = await response.json();

        // Update the UI by calling the onAddNote callback with the data from the server
        onAddNote(data);

        // Clear the input field
        setNote("");
        setError(null);
      }
    } catch (error) {
      console.error("Error adding note:", error);
      setError("Failed to add note. Please try again.");
    }
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Type your note..."
        value={note}
        onChange={handleInputChange}
      />
      <button onClick={handleAddNote}>Add Note</button>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default AddNote;
