import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import Card from "../Components/Card";
import Input from "../Components/Input";
import NotRobot from "../Components/NotRobot";
import LoginButton from "../Components/LoginButtons";
import ErrorMessage from "../Components/ErrorMessage";

import useJWT from "../Hooks/useJWT";

const Login = (props) => {
  const { login } = useJWT();
  const validEmail = new RegExp(
    "^[a-zA-Z0-9._:$!%-]+@[a-zA-Z0-9.-]+.[a-zA-Z]$"
  );
  let navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [notRobot, setNotRobot] = useState(true);
  const [disabledLoginButton, setDisabledLoginButton] = useState(true);
  const [hiddenErrorMessageAndNotRobot, setHiddenErrorMessageAndNotRobot] =
    useState(true);

  function checkIsDisabledLoginButton(email, password, notRobot) {
    if (!!email && !!password && validEmail.test(email) && notRobot === true)
      setDisabledLoginButton(false);
    else setDisabledLoginButton(true);
  }

  function operationWhenFailAuth() {
    setHiddenErrorMessageAndNotRobot(false);
    setNotRobot(false);
    setPassword("");
  }

  const loginOperation = () => {
    console.log(1);
    login(email, password)
      .then((response) => {
        if (!!response.access && !!response.refresh) navigate("/");
      })
      .catch((exception) => {
        operationWhenFailAuth();
      });
  };
  return (
    <Card>
      <h3>Login</h3>

      <Input
        data-testid="email"
        label="✉️ Email"
        type="email"
        value={email}
        onChange={(event) => {
          setEmail(event.target.value);
          checkIsDisabledLoginButton(event.target.value, password, notRobot);
        }}
      />

      <Input
        data-testid="password"
        label="🔑 Password"
        type="password"
        value={password}
        onChange={(event) => {
          setPassword(event.target.value);
          checkIsDisabledLoginButton(email, event.target.value, notRobot);
        }}
      />
      {hiddenErrorMessageAndNotRobot === false ? (
        <>
          <NotRobot
            checked={notRobot}
            onChange={(event) => {
              setNotRobot(!notRobot);
              checkIsDisabledLoginButton(email, password, !notRobot);
            }}
          />
          <ErrorMessage />
        </>
      ) : null}

      <LoginButton onClick={loginOperation} disabled={disabledLoginButton} />
    </Card>
  );
};

export default Login;
