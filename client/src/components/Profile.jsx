import { useState } from "react";
import logo from "../assets/logo.png";
import "../styles/Profile.css";

const Profile = () => {
  return (
    <>
      <div>
        <article className="img-logo">
          <img className="logo" src={logo} alt="logo" />
        </article>{" "}
        <section className="logo-area">
          <h1>Secure profile</h1>
        </section>
        <main className="">
          <>
            <article className="">
              <h4 className="welcome" onClick={register}>
                `Welcome, ${username}!`
              </h4>
              <h4 className="message" onClick={register}>
                You're set up now.
              </h4>
            </article>
          </>
        </main>
        <footer>
          <p className="attribution">
            Design by{" "}
            <a href="https://portfolio-ms-app.onrender.com/" target="_blank">
              Top Weaver
            </a>
          </p>
        </footer>
      </div>
    </>
  );
};

export default Profile;
