import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Container, InputGroup, Form, Button } from "react-bootstrap";
import { MdEmail } from "react-icons/md";
import Inkbox from "./logo/logo.png";
import "./css/account.css";
import { RiLockPasswordFill } from "react-icons/ri";
import Swal from "sweetalert2";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const validateUser = async () => {
    if (email === "" || password === "") {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Both email and password are required.",
      });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Please enter a valid email address.",
      });
      return;
    }

    const response = await fetch("http://appnote.test/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
      

    });

    const data = await response.json();

    console.log(data);

    navigate("/view");

    // after login, the id is obtained for adding a note
    const user_id = data.user.id;
    localStorage.setItem("data", user_id);

    if (!data.ok) {
      if (data.message === "Email does not exist") {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Email does not exist. Please register.",
        });
      } else if (data.message === "Incorrect password") {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Incorrect password. Please try again.",
        });
      } else {
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Login successful!",
        });
      }
    } else {
      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Login successful!",
      });
    }
  };

  return (
    <Container className="container">
      <div className="img" style={{ backgroundColor: "#393e46" }}>
        <img src={Inkbox} alt="Inkbox Logo" className="img-logo" />
      </div>

      <div className="backdrop">
        <div className="content">
          <h2 className="heading">Login</h2>

          <div className="new">
            <InputGroup className="mb-3">
              <InputGroup.Text id="basic-addon1">
                <MdEmail />                                         
              </InputGroup.Text>
              <Form.Control
                className="input"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="@"
                required
              />
            </InputGroup>
          </div>

          <div className="new">
            <InputGroup className="mb-3">
              <InputGroup.Text id="basic-addon1">
                <RiLockPasswordFill />
              </InputGroup.Text>
              <Form.Control
                className="input"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="********"
                required
              />
            </InputGroup>
          </div>
          <Button variant="primary" className="btn" onClick={validateUser}>
            Login
          </Button>
          <p className="late">
            Don't have an account?{" "}
            <Link to="/register" className="none">
              {" "}
              Register
            </Link>
          </p>
        </div>
      </div>
    </Container>
  );
}

export default Login;
