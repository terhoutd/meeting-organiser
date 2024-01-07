import firebase from "firebase/compat/app";
import * as firebaseui from "firebaseui";
import "firebaseui/dist/firebaseui.css";
import { useEffect } from "react";
import { auth } from "../../others/firebase";

function LoginPage() {
  useEffect(() => {
    const ui = firebaseui.auth.AuthUI.getInstance() || new firebaseui.auth.AuthUI(auth);

    ui.start("#firebaseui-auth-container", {
      callbacks: {
        signInSuccessWithAuthResult: function (authResult, redirectUrl) {
          // Action if the user is authenticated successfully
          console.log("authResult", authResult);
          console.log("redirectUrl", redirectUrl);
          return false;
        },
        uiShown: function () {
          // This is what should happen when the form is full loaded. In this example, I hide the loader element.
          document.getElementById("loader")!.style.display = "none";
        },
      },
      signInFlow: "popup",

      signInSuccessUrl: "https://www.anyurl.com", // This is where should redirect if the sign in is successful.
      signInOptions: [
        firebase.auth.GoogleAuthProvider.PROVIDER_ID,
        firebase.auth.FacebookAuthProvider.PROVIDER_ID,
        {
          provider: firebase.auth.GithubAuthProvider.PROVIDER_ID,
          scopes: ["user", "repo"],
        },
      ],
      tosUrl: "https://www.example.com/terms-conditions", // URL to you terms and conditions.
      privacyPolicyUrl: function () {
        // URL to your privacy policy
        window.location.assign("https://www.example.com/privacy-policy");
      },
    });
  }, []);
  return (
    <div className="flex min-h-screen flex-col justify-center bg-gray-50">
      <div className="mx-auto w-full max-w-md">
        <div className="mt-2 text-center text-3xl font-bold text-gray-900">
          Nice to see you again
        </div>
        <div className="text-center text-sm text-gray-600">
          Log in and get back to smooth scheduling
        </div>
      </div>

      <div className="mx-auto mt-4 w-full max-w-md border border-gray-300 bg-white p-8">
        <div className="mt-6">
          <div id="firebaseui-auth-container"></div>
          <div id="loader" className="text-center">
            Loading form
          </div>
          {/* Replace below hrefs with your authentication provider's link */}
        </div>
      </div>

      <div className="mx-auto mt-6 w-full max-w-md text-center">
        <p className="text-sm">
          This site is protected by reCAPTCHA and the Google Privacy Policy and Terms of Service
          apply.
        </p>
        <p className="mt-4">
          Don't have an account yet?{" "}
          <a href="#" className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;
