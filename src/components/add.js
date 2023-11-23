import React, { useState } from "react";


function Addnote() {
  const [question, setQuestion] = useState("");
  const userID = localStorage.getItem('data');
  const [error, setError] = useState("");

  const addnote = async () => {
    const response = await fetch("http://thesis.test/api/question", {
      method: "POST",
      headers: {
        'Accept': 'application/json',
        "Content-Type": 'application/json',
      },
      body: JSON.stringify({
        userID,
        question,
      }),
    });

    const data = await response.json();

    if (!data.ok) {
      setError(data.message);
    }

    alert("Question submitted successfully");

  };

  return (
    <div>
      <input
        type="text"
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        placeholder="Question"
      />
      <button onClick={addnote}>Submit</button>
      {error && <p>{error}</p>}
    </div>
  );
}

export default Addnote;