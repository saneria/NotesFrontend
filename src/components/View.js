import React, { useState, useEffect } from "react";
import AddNote from "./AddNote";

const View = () => {
  const [notesData, setNoteData] = useState([]);
  const [errorMessage, setErrorMessage] = useState(null);
  const [selectedNote, setSelectedNote] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [deletedNotes, setDeletedNotes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchNote = async () => {
    const user_id = localStorage.getItem("data");
    try {
      const response = await fetch(`http://appnote.test/api/notes/${user_id}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch notes: ${response.status}`);
      }

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

  const updateSelectedNote = (updatedNote) => {
    setSelectedNote(updatedNote);
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
        fetchNote(); // Refresh the notes after deletion
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
        const restoredNoteIndex = deletedNotes.findIndex(
          (note) => note.note_id === noteId
        );
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

  const filteredNotes = notesData.filter((note) =>
    note.notes_title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      <div>
        {/* Search input */}
        <input
          type="text"
          placeholder="Search notes"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ marginBottom: "10px" }}
        />

        <div style={{ display: "flex" }}>
          {/* Active notes section */}
          <div
            style={{
              border: "1px solid #ccc",
              borderRadius: "5px",
              padding: "10px",
              width: "250px",
              height: "688px",
              overflowY: "auto",
            }}
          >
            {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
            <h2>Notes</h2>
            {filteredNotes.map((note, index) => (
              <div
                key={index}
                style={{
                  marginBottom: "20px",
                  borderBottom: "1px solid #ccc",
                  paddingBottom: "10px",
                  cursor: "pointer",
                }}
                onClick={() => {
                  setSelectedNote(note);
                  setEditMode(false);
                }}
              >
                <strong>{note.notes_title}</strong> <br />
                <strong>Created At:</strong>{" "}
                {new Intl.DateTimeFormat("en-US", {
                  dateStyle: "medium",
                  timeStyle: "medium",
                }).format(new Date(note.created_at))}{" "}
                <br />
                <strong>Updated At:</strong>{" "}
                {new Intl.DateTimeFormat("en-US", {
                  dateStyle: "medium",
                  timeStyle: "medium",
                }).format(new Date(note.updated_at))}{" "}
                <br />
                {/* Add delete button here */}
                <button
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent the click event from propagating to the parent div
                    handleDeleteButtonClick(note.note_id);
                  }}
                >
                  Delete
                </button>
              </div>
            ))}
          </div>

          <div
            style={{
              border: "1px solid #ccc",
              borderRadius: "5px",
              padding: "10px",
              width: "250px",
              height: "688px",
              overflowY: "auto",
            }}
          >
            <h2>Deleted Notes</h2>
            {deletedNotes.map((deletedNote, index) => (
              <div
                key={index}
                style={{
                  marginBottom: "20px",
                  borderBottom: "1px solid #ccc",
                  paddingBottom: "10px",
                  cursor: "pointer",
                }}
              >
                <strong>Note ID:</strong> {deletedNote.note_id} <br />
                <strong>Note Title:</strong> {deletedNote.notes_title} <br />
                <strong>Notes:</strong> {deletedNote.notes} <br />
                <strong>Deleted At:</strong>{" "}
                {new Intl.DateTimeFormat("en-US", {
                  dateStyle: "medium",
                  timeStyle: "medium",
                }).format(new Date(deletedNote.updated_at))}
                <br />
                <button
                  onClick={() => handleRestoreButtonClick(deletedNote.note_id)}
                >
                  Restore
                </button>
              </div>
            ))}
          </div>

          {/* display for selecting specific note  */}
          {selectedNote && !editMode && (
            <AddNote
              selectedNote={selectedNote}
              updateSelectedNote={updateSelectedNote}
            />
          )}
          {/* display for adding note */}
          {!selectedNote && !editMode && (
            <AddNote updateSelectedNote={updateSelectedNote} />
          )}
        </div>
      </div>
    </div>
  );
};

export default View;
