import React, { useState, useEffect } from "react";
import { jsPDF } from "jspdf";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useNavigate } from "react-router-dom";
import "./css/style.css";
import { TbLogout2 } from "react-icons/tb";
import { FaRegUser } from "react-icons/fa";
import { RiAccountCircleFill } from "react-icons/ri";
import { IoAddCircleSharp } from "react-icons/io5";
import { MdSave } from "react-icons/md";
import { HiSave } from "react-icons/hi";

const AddNote = ({ selectedNote, updateSelectedNote }) => {
  const [notes, setNotes] = useState("");
  const [notes_title, setTitle] = useState("");
  const user_id = localStorage.getItem("data");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);

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

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const handleProfile = () => {
    navigate("/profile");
  };

  const handleLogout = () => {
    localStorage.removeItem("data");
    navigate("/");
  };

  return (
    <div className="wrapper">
      <div className="main" style={{ position: "relative" }}>
        <RiAccountCircleFill
          className="profile-icon"
          style={{
            position: "absolute",
            top: "30px",
            right: "70px",
            cursor: "pointer",
            width: "50px",
            height: "80px",
          }}
          onClick={toggleDropdown}
        />
        {showDropdown && (
          <div
            style={{
              position: "absolute",
              top: "50px",
              right: "-1px",
              borderRadius: "5px",
              boxShadow: "0 2px 4px rgba(0,0,0,.1)",
              zIndex: 1,
            }}
          >
            <ul style={{ listStyle: "none" }}>
              <li>
                <button
                  onClick={handleProfile}
                  disabled={loading}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    padding: "8px 10px",
                    border: "none",
                    borderRadius: "5px",
                    backgroundColor: "black", 
                    color: "#fff", 
                    cursor: "pointer",
                    transition: "background-color 0.3s",
                    outline: "none", 
                  }}
                >
                  <FaRegUser
                    style={{ fontSize: "1.2em", marginRight: "8px" }}
                  />
                </button>
              </li>
              <li>
                <br />
                <button
                  onClick={handleLogout}
                  disabled={loading}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    padding: "8px 10px",
                    border: "none",
                    borderRadius: "5px",
                    backgroundColor: "black", // You can change the background color
                    color: "#fff", // You can change the text color
                    cursor: "pointer",
                    transition: "background-color 0.3s",
                    outline: "none", // Remove default button outline
                  }}
                >
                  <TbLogout2 style={{ fontSize: "1.2em" }} />
                </button>
              </li>
            </ul>
          </div>
        )}
        <div className="maincon">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            {/* <h2 style={{ flex: "1", marginBottom: "10px" }}>Add Note</h2> */}
            <button
              onClick={handleSavePDF}
              disabled={loading}
              style={{
                backgroundColor: "transparent",
                border: "none",
                fontSize: "1.5em",
                cursor: "pointer",
                marginRight: "10px",
              }}
            >
              <HiSave className="savepdf" />
            </button>
          </div>
          <div
            style={{
              marginBottom: "10px",
              position: "relative",
              border: "none",
              marginTop: "50px",
            }}
          >
            <input
              type="text"
              className="title"
              placeholder="Enter note title"
              value={notes_title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={loading}
            />
            <br />
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
          </div>
          <br />
          <br />
        </div>
        <div
          className="add-save"
          style={{
            position: "absolute",
            bottom: "40px",
            right: "80px",
            borderRadius: "7px",
            border: "none",
            justifyContent: "center",
          }}
        >
          {!selectedNote && (
            <button
              onClick={handleAddNote}
              disabled={loading}
              style={{
                fontSize: "1em",
                cursor: "pointer",
                border: "none",
                backgroundColor: "black",
                color: "white",
                padding: "6px 8px",
                borderRadius: "8px",
                transition:
                  "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
                boxShadow: "0 0 8px rgba(255, 255, 255, 0.5)",
              }}
            >
              {loading ? (
                "Adding..."
              ) : (
                <>
                  <IoAddCircleSharp className="add-icon" /> Add Note
                </>
              )}
            </button>
          )}

          {selectedNote && (
            <button
              onClick={handleUpdateNote}
              disabled={loading}
              style={{
                fontSize: "1em",
                cursor: "pointer",
                border: "none",
                backgroundColor: "black",
                color: "white",
                padding: "6px 8px",
                borderRadius: "8px",
                transition:
                  "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
                boxShadow: "0 0 8px rgba(255, 255, 255, 0.5)",
              }}
            >
              {loading ? (
                "Updating..."
              ) : (
                <>
                  <MdSave /> Save
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddNote;
