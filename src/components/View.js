import React, { useState, useEffect } from "react";
import AddNote from "./AddNote";
import "./css/addnote.css";
import { ImSearch } from "react-icons/im";
import { MdDelete } from "react-icons/md";
import { HiTrash, HiOutlineTrash } from "react-icons/hi";

const View = () => {
  const [notesData, setNoteData] = useState([]);
  const [errorMessage, setErrorMessage] = useState(null);
  const [selectedNote, setSelectedNote] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [deletedNotes, setDeletedNotes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showDeletedNotes, setShowDeletedNotes] = useState(false);
  const [selectedNotes, setSelectedNotes] = useState([]);
  const [deleteButtonIndex, setDeleteButtonIndex] = useState(null);
  const [deleteButtonVisible, setDeleteButtonVisible] = useState(false);

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
        fetchNote(); // refreshes the notes after deletion
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

  const handleNoteCheckboxChange = (noteId) => {
    const isSelected = selectedNotes.includes(noteId);

    if (isSelected) {
      setSelectedNotes(selectedNotes.filter((id) => id !== noteId));
    } else {
      setSelectedNotes([...selectedNotes, noteId]);
    }
  };

  const handleMouseEnter = (index) => {
    setDeleteButtonIndex(index);
    setDeleteButtonVisible(true);
  };

  const handleMouseLeave = () => {
    setDeleteButtonVisible(false);
  };

  const deleteIconSize = 24;
  const trashIconSize = 30;

  return (
    <div>
      <div>
        <div className="sidebar" style={{ display: "flex" }}>
          <div
            className="sidebar-style"
            style={{
              border: "1px solid #ccc",
              padding: "10px",
              width: "20%",
              height: "auto",
              boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.3)",
              backgroundColor: "rgb(46,50,56)",
            }}
          >
            {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
            <h2 className="notes-heading">Notes</h2>

            {/* search*/}
            <input
              type="text"
              placeholder="Search notes"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                marginBottom: "10px",
                border: "1px solid #ccc",
                padding: "8px",
                width: "100%",
                height: "auto",
                boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.3)",
                backgroundColor: "rgb(249,250,250)",
                borderRadius: "30px",
              }}
            />
            <ImSearch
              style={{
                marginLeft: "-27px",
                position: "absolute",
                zIndex: 1,
                marginTop: "9px",
              }}
            />

            {filteredNotes.map((note, index) => (
              <div
                className="style-side"
                key={index}
                style={{
                  color: "rgb(249,250,250)",
                  marginTop: "30px",
                  marginBottom: "20px",
                  borderBottom: "1px solid #ccc",
                  paddingBottom: "10px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  boxShadow: "10px 10px 30px rgba(0, 0, 0, 0.1)",
                  borderRadius: "5px",
                  position: "relative",
                  transition: "transform 0.3s ease-in-out",
                  transform:
                    deleteButtonIndex === index
                      ? "translateX(-30px)"
                      : "translateX(0)",
                }}
                onMouseEnter={() => handleMouseEnter(index)}
                onMouseLeave={handleMouseLeave}
                onClick={() => {
                  setSelectedNote(note);
                  setEditMode(false);
                }}
              >
                {/* checkbox */}
                <input
                  type="checkbox"
                  checked={selectedNotes.includes(note.note_id)}
                  onChange={() => handleNoteCheckboxChange(note.note_id)}
                  style={{ marginRight: "10px" }}
                />
                <div>
                  <strong>{note.notes_title} </strong> <br />
                  <span style={{ fontSize: "12px" }}>
                    {new Intl.DateTimeFormat("en-US", {
                      dateStyle: "medium",
                      timeStyle: "medium",
                    }).format(new Date(note.updated_at))}
                  </span>{" "}
                  <br />
                  {/* delete button */}
                  {deleteButtonIndex === index && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation(); // prevent the click event from propagating to the parent div
                        handleDeleteButtonClick(note.note_id);
                      }}
                      style={{
                        position: "absolute",
                        top: "0",
                        right: "0",
                        visibility: deleteButtonVisible ? "visible" : "hidden",
                        backgroundColor: "transparent",
                        border: "none",
                        cursor: "pointer",
                      }}
                    >
                      <MdDelete size={deleteIconSize} className="delete-icon" />
                    </button>
                  )}
                </div>
              </div>
            ))}

            {/* toggle button for deleted notes */}
            <div className="trash-icon" style={{ position: "relative" }}>
              <button
                onClick={() => setShowDeletedNotes(!showDeletedNotes)}
                style={{
                  position: "fixed",
                  bottom: "25px",
                  left: "150px",
                  transform: "translateX(-50%)",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "10px",
                  border: "none",
                  cursor: "pointer",
                  display: "flex",
                  borderRadius: "10px",
                  background: "none",
                }}
                className="trash-icon"
              >
                {showDeletedNotes ? (
                  <HiOutlineTrash size={trashIconSize} />
                ) : (
                  <HiTrash size={trashIconSize} />
                )}
                {showDeletedNotes ? (
                  <span
                    style={{
                      marginLeft: "3px",
                      fontWeight: "bold",
                      fontFamily: "Nunito Sans",
                      fontSize: "1.2rem",
                      color: "white",
                    }}
                  >
                    Hide Trash
                  </span>
                ) : (
                  <span
                    style={{
                      marginLeft: "3px",
                      fontWeight: "bold",
                      fontFamily: "Nunito Sans",
                      fontSize: "1.2rem",
                      color: "white",
                    }}
                  >
                    Trash
                  </span>
                )}
              </button>
            </div>
          </div>

          {showDeletedNotes && (
            <div
              style={{
                padding: "10px",
                width: "100%",
                height: "85vh",
                backgroundColor: "white",
                marginTop: "50px",
                marginLeft: "45px",
                marginRight: "45px",
                borderRadius: "15px",
              }}
            >
              <h2>Deleted Notes</h2>
              {deletedNotes.map((deletedNote, index) => (
                <div
                  key={index}
                  style={{
                    display: "flex",
                    width: "85%",
                    marginTop: "20px",
                    marginBottom: "20px",
                    marginLeft: "10px",
                    borderBottom: "1px solid #ccc",
                    paddingBottom: "10px",
                    cursor: "pointer",
                    backgroundColor: "#f8f8f8",
                    borderRadius: "8px",
                    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                    transition: "background-color 0.3s ease",
                  }}
                >
                  <div className="delete-details">
                    <br />
                    <strong> {deletedNote.notes_title}</strong> <br />
                    <normal>Deleted At:</normal>{" "}
                    {new Intl.DateTimeFormat("en-US", {
                      dateStyle: "medium",
                      timeStyle: "medium",
                    }).format(new Date(deletedNote.updated_at))}
                    <br />
                    <button
                      onClick={() =>
                        handleRestoreButtonClick(deletedNote.note_id)
                      }
                      style={{
                        padding: "8px 16px",
                        background: "black",
                        color: "#fff",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer",
                        transition: "background 0.3s ease",
                        marginLeft: "182px",
                        marginBottom: "15px",
                      }}
                    >
                      Restore
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* display for selecting specific note  */}
          {selectedNote && !editMode && !showDeletedNotes && (
            <AddNote
              selectedNote={selectedNote}
              updateSelectedNote={updateSelectedNote}
            />
          )}

          {/* display for adding note */}
          {!selectedNote && !editMode && !showDeletedNotes && (
            <AddNote updateSelectedNote={updateSelectedNote} />
          )}
        </div>
      </div>
    </div>
  );
};

export default View;
