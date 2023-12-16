import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Notes = () => {
  const [notesData, setNoteData] = useState([]);
  const [deletedNotes, setDeletedNotes] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [editedNote, setEditedNote] = useState({ title: "", content: "" });
  const [editMode, setEditMode] = useState(false);
  const [selectedNoteId, setSelectedNoteId] = useState(null);
  const navigate = useNavigate();
  

  const fetchNote = async () => {
    const user_id = localStorage.getItem("data");

    try {
      const response = await fetch(`http://appnote.test/api/notes/${user_id}`);
      const data = await response.json();
      setNoteData(data);
      setErrorMessage(null);
    } catch (error) {
      console.error("Error fetching notes:", error);
      setErrorMessage("Error fetching notes");
    }
  };

  useEffect(() => {
    fetchNote();
  }, []);
  

  const handleEditButtonClick = (noteId) => {
    const noteToEdit = notesData.find((note) => note.note_id === noteId);

    setEditedNote({
      title: noteToEdit.notes_title,
      content: noteToEdit.notes,
    });

    setEditMode(true);
    setSelectedNoteId(noteId);
  };

  const handleSaveButtonClick = async () => {
    if (!selectedNoteId) {
      console.error("No note selected for editing");
      return;
    }

    setLoading(true);

    try {
      const updatedNoteData = {
        notes_title: editedNote.title,
        notes: editedNote.content,
      };

      const response = await fetch(`http://appnote.test/api/notes/edit/${selectedNoteId}`, {
        method: "PUT",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedNoteData),
      });

      if (response.ok) {
        console.log("Note updated successfully!");
        setEditMode(false);
        setSelectedNoteId(null);
      } else {
        console.error("Error updating note");
      }
    } catch (error) {
      console.error("Error during note update:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteButtonClick = async (noteId) => {
    setLoading(true);

    try {
      const response = await fetch(`http://appnote.test/api/notes/${noteId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        console.log("Note deleted successfully!");
        const deletedNote = notesData.find((note) => note.note_id === noteId);
        setDeletedNotes([...deletedNotes, deletedNote]);
        fetchNote(); 
      } else {
        console.error("Error deleting note");
      }
    } catch (error) {
      console.error("Error during note deletion:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRestoreButtonClick = async (noteId) => {
    setLoading(true);

    try {
      const response = await fetch(`http://appnote.test/api/notes/${noteId}`, {
        method: "PUT",
      });

      if (response.ok) {
        console.log("Note restored successfully!");
        const restoredNoteIndex = deletedNotes.findIndex((note) => note.note_id === noteId);
        const updatedDeletedNotes = [...deletedNotes];
        updatedDeletedNotes.splice(restoredNoteIndex, 1);
        setDeletedNotes(updatedDeletedNotes);
        fetchNote();
      } else {
        console.error("Error restoring note");
      }
    } catch (error) {
      console.error("Error during note restoration:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("data");
    navigate("/");
  
    
  };

  return (
    <div>
      <h2>Note List</h2>
      <ul>
        {notesData.map((note, index) => (
          <li key={index}>
            <strong>Note ID:</strong> {note.note_id} <br />
            <strong>Note Title:</strong> {note.notes_title} <br />
            <strong>Notes:</strong> {note.notes} <br />
            <strong>Created At:</strong> {note.created_at} <br />
            <strong>Updated At:</strong> {note.updated_at} <br />
            <hr />
            {editMode && selectedNoteId === note.note_id && (
              <div>
                <textarea
                  value={editedNote.title}
                  onChange={(e) => setEditedNote({ ...editedNote, title: e.target.value })}
                />
                <textarea
                  value={editedNote.content}
                  onChange={(e) => setEditedNote({ ...editedNote, content: e.target.value })}
                />
                <button onClick={handleSaveButtonClick} disabled={loading}>
                  Save
                </button>
              </div>
            )}
            {!editMode && (
              <>
                <button onClick={() => handleEditButtonClick(note.note_id)} disabled={loading}>
                  Update Note
                </button>       
                <button onClick={() => handleDeleteButtonClick(note.note_id)} disabled={loading}>
                  Delete Note
                </button>
              </>
            )}
          </li>
        ))}
      </ul>

      <h2>Deleted Notes</h2>
      <ul>
        {deletedNotes.map((deletedNote, index) => (
          <li key={index}>
            <strong>Note ID:</strong> {deletedNote.note_id} <br />
            <strong>Note Title:</strong> {deletedNote.notes_title} <br />
            <strong>Notes:</strong> {deletedNote.notes} <br />
            <strong>Deleted At:</strong> {deletedNote.deleted_at} <br />

            <button onClick={() => handleRestoreButtonClick(deletedNote.note_id)} disabled={loading}>
              Restore Note
            </button>
            <hr />
          </li>
        ))}
      </ul>

      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default Notes;
