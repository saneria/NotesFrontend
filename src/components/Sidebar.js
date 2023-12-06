import React from 'react';

const Sidebar = ({ notes }) => {
  // Check if notes is an array before using map
  if (!Array.isArray(notes)) {
    // Handle the case where notes is not an array, e.g., set notes to an empty array
    notes = [];
  }

  return (
    <div>
      <h2>Sidebar</h2>
      <ul>
        {notes.map((note, index) => (
          <li key={index}>{note}</li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
