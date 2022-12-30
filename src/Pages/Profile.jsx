import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Row from "../Components/Row";
import UserData from "../Components/UserData";
import LogoutButton from "../Components/LogoutButton";

import useJWT from "../Hooks/useJWT";

const Profile = () => {
  const [user, setUser] = useState({});
  let navigate = useNavigate();

  const { sendPostRequest, logout } = useJWT();

  const getUser = () => {
    console.log(12);
    return sendPostRequest("user");
  };

  useEffect(() => {
    let token = localStorage.getItem("access");
    console.log("token = ", token);
    if (token != null) {
      getUser()
        .then((response) => {
          console.log("response 1= ", response);
          if (response.data === undefined || response.data == null)
            navigate("/login");
          else setUser(response.data.user);
        })
        .catch((exception) => {
          console.log("exception = ", exception.toString());
          navigate("/login");
        });
    } else {
      navigate("/login");
    }
  }, []);

  const logOut = () => {
    logout().then((response) => {
      navigate("/login");
    });
  };

  return (
    <div className="container">
      <Row>
        <UserData label="Name">{user.name}</UserData>
        <UserData label="Family">{user.lastname}</UserData>
      </Row>

      <Row>
        <UserData label="Phone">{user.phone}</UserData>
        <UserData label="Address">{user.address}</UserData>
      </Row>

      <Row>
        <UserData label="Email">{user.email}</UserData>
        <UserData label="Password">{user.password}</UserData>
      </Row>

      <LogoutButton
        onClick={() => {
          logOut();
        }}
      />
    </div>
  );
};

export default Profile;
