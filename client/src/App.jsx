import { useState } from "react";
import logo from "./assets/logo.png";

import "./App.css";

function App() {
  const [showSignUp, setShowSignUp] = useState(false);

  const register = () => {
    const bodyEl = document.querySelector("body");
    const registerBtn = document.querySelector(".register-btn");

    bodyEl.classList.add("absolute-bg");
    registerBtn.classList.add("hide");

    setShowSignUp(true);
  };

  return (
    <>
      <body>
      <article className="img-logo">
            <img className="logo" src={logo} alt="logo" />
          </article>{" "}
        <section className="logo-area">
          
          <h1>Secure your profile</h1>
        </section>

        <main className="">
          <>
            <article className="">
              <button className="register-btn" onClick={register}>
                Register
              </button>
            </article>
          </>
        </main>

        {showSignUp && (
          <section className="signup">
            <h3 >Register</h3>
            <form action="">
              <label htmlFor="username">
                <p> Username:</p>
                <input type="text" name="username" id="" />
              </label>

              <label htmlFor="email">
                <p>Email:</p>
                <input type="email" name="email" id="" />
              </label>

              <label htmlFor="password">
                <p>Password:</p>

                <input type="password" name="password" id="" />
              </label>

              <button type="submit">Submit</button>
            </form>
          </section>
        )}

        <footer>
          <p className="attribution">
            Design by{" "}
            <a href="https://portfolio-ms-app.onrender.com/" target="_blank">
              Top Weaver
            </a>
          </p>
        </footer>
      </body>
    </>
  );
}

export default App;
