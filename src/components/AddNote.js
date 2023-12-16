import React, { useState, useEffect } from "react";
import { jsPDF } from "jspdf";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useNavigate } from "react-router-dom";

const AddNote = ({ selectedNote, updateSelectedNote }) => {
  const [notes, setNotes] = useState("");
  const [notes_title, setTitle] = useState("");
  const user_id = localStorage.getItem("data");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // setting initial value if note is selected
  useEffect(() => {
    if (selectedNote) {
      setTitle(selectedNote.notes_title || "");
      setNotes(selectedNote.notes || "");
    }
  }, [selectedNote]);

  const handleAddNote = async () => {
    setLoading(true);

    try {
      const apiUrl = "http://appnote.test/api/notes";

      const response = await fetch(apiUrl, {
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

        if (selectedNote) {
          updateSelectedNote({
            ...selectedNote,
            notes_title,
            notes,
          });
        }
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

  const handleUpdateNote = async () => {
    setLoading(true);

    try {
      if (!selectedNote) {
        console.error("No note selected for updating");
        return;
      }

      const apiUrl = `http://appnote.test/api/notes/edit/${selectedNote.note_id}`;

      const response = await fetch(apiUrl, {
        method: "PUT",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          notes_title,
          notes,
        }),
      });

      const data = await response.json();
      console.log(data);

      if (response.ok) {
        alert("Note updated successfully!");

        if (selectedNote) {
          updateSelectedNote({
            ...selectedNote,
            notes_title,
            notes,
          });
        }
      } else {
        alert(`Failed to update note: ${data.message}`);
      }
    } catch (error) {
      console.error("Error updating note:", error.message);
      alert("An error occurred while updating the note");
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

  return (
    <div className="wrapper">
      <div className="sidebar">
        <h2>Add Note</h2>
        <input
          type="text"
          placeholder="Enter note title"
          value={notes_title}
          onChange={(e) => setTitle(e.target.value)}
          disabled={loading}
        />
        <br />
        <ReactQuill
          theme="snow"
          value={notes}
          onChange={setNotes}
          modules={{
            toolbar: [
              ["bold", "italic", "underline"], 
              [{ header: 1 }, { header: 2 }], 
              [{ list: "ordered" }, { list: "bullet" }],
              [{ indent: "-1" }, { indent: "+1" }], 
              [{ size: ["small", false, "large", "huge"] }], 
              [{ font: [] }],
              [{ align: [] }],
              ["clean"], 
              ["checkbox"], 
            ],
          }}
          readOnly={loading}
        />
        <br />
        {!selectedNote && (
          <button onClick={handleAddNote} disabled={loading}>
            {loading ? "Adding..." : "Add Note"}
          </button>
        )}
        {selectedNote && (
          <button onClick={handleUpdateNote} disabled={loading}>
            {loading ? "Updating..." : "Save"}
          </button>
        )}
        <br />
        <button onClick={handleSavePDF} disabled={loading}>
          Save as PDF
        </button>
      </div>

      <br />
      <button onClick={handleLogout}>Logout</button>
      <br />
    </div>
  );
};

export default AddNote;
