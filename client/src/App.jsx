import { useState } from "react";
import logo from "./assets/logo.png";

import "./App.css";

function App() {
  const [showSignUp, setShowSignUp] = useState(false);

  const register = () => {
    setShowSignUp(true);
  };

  return (
    <>
      <body>
        <article className="img-logo">
        <img className="logo" src={logo} alt="logo" />

        </article>
        <main className="">
          <>
            <article className="">
              <h1>Secure your profile</h1>
              <button onClick={register}>Register</button>
            </article>
          </>
        </main>
        
      </body>
      <></>

      <footer>
        <p className="attribution">
          Design by{" "}
          <a href="https://portfolio-ms-app.onrender.com/" target="_blank">
            Top Weaver
          </a>
        </p>
      </footer>
    </>
  );
}

export default App;
