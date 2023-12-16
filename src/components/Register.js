import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, InputGroup, FormControl, Button } from "react-bootstrap";
import { MdEmail } from "react-icons/md";
import Inkbox from "./logo/logo.png";
import "./css/account.css";
import { RiLockPasswordFill } from "react-icons/ri";
import { IoPerson } from "react-icons/io5";
import Swal from "sweetalert2";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const registerUser = async () => {
    // Check if any individual field is empty
    if (name === "") {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Name field is required.",
      });
      return;
    }

    if (email === "") {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Email field is required.",
      });
      return;
    }

    // Check if the entered email is a valid email address
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Please enter a valid email address.",
      });
      return;
    }

    if (password === "") {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Password field is required.",
      });
      return;
    }

    if (confirmPassword === "") {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Confirm Password field is required.",
      });
      return;
    }

    // Check if password and confirm password match
    if (password !== confirmPassword) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Passwords do not match. Please check and try again.",
      });
      return;
    }

    const response = await fetch("http://appnote.test/api/user", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        email,
        password,
      }),
    });

    const data = await response.json();

    if (!data.ok) {
      // Using SweetAlert for error messages
      if (data.message === "Email already exists") {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Email already exists. Please use a different email address.",
        });
      } else {
        // Displaying a generic error alert for other cases
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Registration unsuccessful. Please try again.",
        });
      }
      setError(data.message);
    } else {
      // SweetAlert for successful registration
      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Account created successfully!",
      });
      navigate("/");
    }
  };

  return (
    <Container className="container">
      <div className="img" style={{ backgroundColor: "#393e46" }}>
        <img src={Inkbox} alt="Inkbox Logo" className="img-logo" />
      </div>

      <div className="backdrop">
        <div className="content">
          <h2 className="heading">Register</h2>

          <div className="new">
            <InputGroup className="mb-3">
              <InputGroup.Text id="basic-addon1">
                <IoPerson />
              </InputGroup.Text>
              <FormControl
                className="input"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Full Name"
              />
            </InputGroup>
          </div>

          <div className="new">
            <InputGroup className="mb-3">
              <InputGroup.Text id="basic-addon1">
                <MdEmail />
              </InputGroup.Text>
              <FormControl
                className="input"
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
              />
            </InputGroup>
          </div>

          <div className="new">
            <InputGroup className="mb-3">
              <InputGroup.Text id="basic-addon1">
                <RiLockPasswordFill />
              </InputGroup.Text>
              <FormControl
                className="input"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
              />
            </InputGroup>
          </div>

          <div className="new">
            <InputGroup className="mb-3">
              <InputGroup.Text id="basic-addon1">
                <RiLockPasswordFill />
              </InputGroup.Text>
              <FormControl
                className="input"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm Password"
              />
            </InputGroup>
          </div>

          <Button variant="primary" onClick={registerUser}>
            Register
          </Button>

          {error && <p>{error}</p>}
        </div>
      </div>
    </Container>
  );
}

export default Register;
