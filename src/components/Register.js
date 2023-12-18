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
    try {
      if (name === "" || email === "" || password === "" || confirmPassword === "") {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "All fields are required.",
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
        if (data.message === "Email already exists") {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "Email already exists. Please use a different email address.",
          });
        } else {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "Registration unsuccessful. Please try again.",
          });
        }
        setError(data.message);
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "An unexpected error occurred. Please try again.",
        });
        console.error("Error registering user:", error);
  
      }
    } catch (error) {

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
