import React, { useState, useEffect } from "react";
import { jsPDF } from "jspdf";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useNavigate } from "react-router-dom";
import "./css/style.css";
import { TbLogout2 } from "react-icons/tb";
import { FaRegUser } from "react-icons/fa";
import { RiAccountCircleFill } from "react-icons/ri";
import { HiSave } from "react-icons/hi";
import "bootstrap-icons/font/bootstrap-icons.css";
import { Dropdown } from "react-bootstrap";

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
    <div>
      <div className="main" style={{ position: "relative" }}>
        <RiAccountCircleFill
          className="profile-icon"
          style={{
            position: "absolute",
            top: "30px",
            right: "80px",
            cursor: "pointer",
            width: "50px",
            height: "80px",
          }}
          onClick={toggleDropdown}
        />

        <Dropdown
          show={showDropdown}
          style={{
            position: "absolute",
            top: "30px",
            right: "160px",
            zIndex: "999",
          }}
        >
          <Dropdown.Toggle
            variant="primary"
            id="dropdown-basic"
          ></Dropdown.Toggle>

          <Dropdown.Menu
            style={{
              backgroundColor: "rgb(57, 62, 70)",
              padding: "8px 8px",
              borderRadius: "10px",
            }}
          >
            <Dropdown.Item
              onClick={handleProfile}
              disabled={loading}
              style={{
                display: "flex",
                alignItems: "center",
                borderRadius: "5px",
              }}
            >
              <FaRegUser
                style={{
                  fontSize: "1.5em",
                  marginRight: "13px",
                }}
              />
              User Profile
            </Dropdown.Item>
            <Dropdown.Item
              onClick={handleLogout}
              disabled={loading}
              style={{
                display: "flex",
                alignItems: "center",
                borderRadius: "5px",
              }}
            >
              <TbLogout2
                style={{
                  fontSize: "1.5em",
                  marginRight: "8px",
                }}
              />
              Logout
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>

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
                position: "absolute",
                width: "50px",
                height: "80px",
                bottom: "90px",
                right: "130px",
              }}
            >
              <HiSave
                className="savepdf"
                style={{
                  fontSize: "1.5em",
                }}
              />
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
            top: "60px",
            left: "75px",
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
                backgroundColor: "#292727",
                color: "white",
                padding: "10px 18px",
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
                  <i className="bi bi-plus-lg text-white">
                    <span style={{ marginLeft: "10px" }}>Add Note</span>
                  </i>
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
                backgroundColor: "#292727",
                color: "white",
                padding: "10px 18px",
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
                  <i className="bi bi-floppy text-white">
                    <span style={{ marginLeft: "10px" }}>Save</span>
                  </i>
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
