import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import { logout } from "../actions/auth";
import logo from "../assets/logo.png";
import "../styles/Profile.css";
import MarkIcon from "./markicon";

const Profile = () => {
  const dispatch = useDispatch();

  const navigate = useNavigate();

  const { user } = useSelector((state) => state.auth);

  const signOut = () => {
    localStorage.clear();
    dispatch(logout());
    navigate("/");
  };

  return (
    <>
      <div>
        <article className="img-logo">
          <img className="logo" src={logo} alt="logo" />
        </article>{" "}
        <section className="logo-area">
          <h1>Secure profile</h1>
        </section>
        <main>
          <>
            <article className="">
              <section className="logged-in">                <>
                  <MarkIcon />
                  {user && (
                    <h4 className="welcome">{`Welcome, ${user.username}!`}</h4>
                  )}
                </>
              </section>

              <button className="register-btn" onClick={signOut}>
                Logout
              </button>
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
