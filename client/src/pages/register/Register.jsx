import axios from "axios";
import { useRef } from "react";
import "./register.css";
import { useHistory } from "react-router";

export default function Register() {
  // useRef is like a “box” that can hold a mutable value in its .current property.
  const username = useRef();
  const email = useRef();
  const password = useRef();
  const passwordAgain = useRef();
  const history = useHistory();

  const handleClick = async (e) => {
    e.preventDefault();
    //If current value of passwordAgain dont match with current value of password
    if (passwordAgain.current.value !== password.current.value) {
      passwordAgain.current.setCustomValidity("Passwords don't match!");
    } else {
      const user = {
        //set current values of these in user as username,email and password
        username: username.current.value,
        email: email.current.value,
        password: password.current.value,
      };
      try {
        //and then post the user to our api
        await axios.post("/auth/register", user);
        //push to the login page
        history.push("/login");
      } catch (err) {
        //If it catches error
        console.log(err);
      }
    }
  };

  return (
    <div className="login">
      <div className="loginWrapper">
        <div className="loginLeft">
          <h3 className="loginLogo">Lamasocial</h3>
          <span className="loginDesc">
            Connect with friends and the world around you on Lamasocial.
          </span>
        </div>
        <div className="loginRight">
          <form className="loginBox"
          //Onsubmitting the form call function handleClick
          onSubmit={handleClick}>
            <input
              placeholder="Username"
              required
              ref={username}
              // If you pass a ref object to React with <div ref={myRef} />, 
              // React will set its .current property to the corresponding DOM node whenever that node changes.
              className="loginInput"
            />
            <input
              placeholder="Email"
              required
              ref={email}
              className="loginInput"
              type="email"
            />
            <input
              placeholder="Password"
              required
              ref={password}
              className="loginInput"
              type="password"
              minLength="6"
            />
            <input
              placeholder="Password Again"
              required
              ref={passwordAgain}
              className="loginInput"
              type="password"
            />
            <button className="loginButton" type="submit">
              Sign Up
            </button>
            <button className="loginRegisterButton">Log into Account</button>
          </form>
        </div>
      </div>
    </div>
  );
}
