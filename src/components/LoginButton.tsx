import React from "react";
import { auth } from "./firebase"; // adjust the path as necessary
import firebase from "firebase/app";

function LoginButton() {
  const signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth
      .signInWithPopup(provider)
      .then((result) => {
        // Handle success
      })
      .catch((error) => {
        // Handle errors
      });
  };

  return <button onClick={signInWithGoogle}>Login with Google</button>;
}

export default LoginButton;
