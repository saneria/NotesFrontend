import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";


function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("")
  const navigate = useNavigate();

  const validateUser = async () => {
    const response = await fetch("http://appnote.test/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password
      }),
    });

    const data = await response.json();

    console.log(data);
    if (!data.ok) {
      setError(data.message);
    }
    //after login ang  id is kuhaon for add note
    const user_id = data.user.id;
    localStorage.setItem('data', user_id);
    
    navigate("/addnote");
  };

  return (
    <div>
      <input
        type="text"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
      />
      <Link to = "/register" >Don't have account?</Link>
      <button onClick={validateUser}>Login</button>
      {error && <p>{error}</p>}
    </div>


  );
}

export default Login;
