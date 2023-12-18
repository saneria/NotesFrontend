import React, { useState, useEffect } from "react";
import { Container, Button, Card, Image } from 'react-bootstrap';
import "./css/viewprofile.css";
import { RiShieldUserFill } from "react-icons/ri";

const ViewProfile = ({ userId, closeModal }) => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const user_id = localStorage.getItem("data");
      try {
        const response = await fetch(`http://appnote.test/api/user/${user_id}`);
        const data = await response.json();
        setUserData(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching user data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, [userId]);

  // Display loading spinner or other UI while data is being fetched
  if (loading) {
    return <div>Loading...</div>;
  }

  // Display user data
  return (
    <Container className="con-pro">
      <div className="d-flex justify-content-center align-items-center">
        <Card>
         
          <div className="upper">
            <Image
              src="https://i.imgur.com/Qtrsrk5.jpg"
              fluid
              alt="User cover"
            />
          </div>
          <RiShieldUserFill  className="profile"/>
          
          <Card.Body className="mt-5 text-center">
            <Card.Title className="text">{userData.name}</Card.Title>
            <Card.Text className="text-muted d-block mb-2">
              {userData.email}
            </Card.Text>
          </Card.Body>
        </Card>
      </div>
    </Container>
  );
};

export default ViewProfile;
