import { useState } from "react";
import { useDispatch } from "react-redux";
import logo from "../assets/logo.png";
import "../styles/Home.css";
import validator from "validator";
import { login } from "../actions/auth";
import { useNavigate } from "react-router-dom";
import { httpProtocol, host, port } from "../env.variables";

const BASE_URL = `${httpProtocol}://${host}:${port}`;

const classNames = (...classes) => {
  return classes.filter(Boolean).join(" ");
};

const Home = () => {
  const [showSignUp, setShowSignUp] = useState(false);
  const [showLogin, setShowLogin] = useState(false);

  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [isDisabled, setDisabled] = useState(true);
  const [message, setMessage] = useState("");

  const dispatch = useDispatch();

  const onChangeEmail = ({ target: { value } }) => {
    setEmail(value);
  };

  const onChangeUsername = ({ target: { value } }) => {
    setUsername(value);
  };

  const onChangePassword = ({ target: { value } }) => {
    setPassword(value);
  };

  const submitInfo = () => {
    if (Object.entries(errors).length === 0) {
      if (showSignUp) {
        const createUser = async () => {
          await fetch(`${BASE_URL}/users`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email,
              username,
              password,
            }),
          });
          setMessage("You have successfully registered.");
          setShowSignUp(false);
        };
        createUser();
      } else if (showLogin) {
        const loginUser = async () => {
          try {
            const response = await fetch(`${BASE_URL}/login`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                email,
                password,
              }),
            });

            const { user, token } = await response.json();
            console.log("User)))))))))))))))))))))))", user);
            console.log("Token)))))))))))))))))))))))", token);
            user.token = token;
            localStorage.setItem("user", JSON.stringify(user));
            dispatch(login(user));

            setMessage("You have successfully logged in.");
            setShowLogin(false);
            navigate("/profile");
          } catch (error) {
            console.log(error);
            setMessage(error.message);
          }
        };
        loginUser();
      }
    }
  };

  const register = () => {
    const bodyEl = document.querySelector("body");
    const registerBtn = document.querySelector(".register-btn");
    const attribution = document.querySelector(".attribution");
    const loginBtn = document.querySelector(".login-btn");

    bodyEl.classList.add("absolute-bg");
    registerBtn.classList.add("hide");
    loginBtn.classList.add("hide");

    attribution.classList.add("hide");

    setShowSignUp(true);
  };

  const signin = () => {
    const bodyEl = document.querySelector("body");
    const registerBtn = document.querySelector(".register-btn");
    const loginBtn = document.querySelector(".login-btn");

    const attribution = document.querySelector(".attribution");

    bodyEl.classList.add("absolute-bg");
    registerBtn.classList.add("hide");
    loginBtn.classList.add("hide");

    attribution.classList.add("hide");

    setShowLogin(true);
  };

  const closeSignUp = () => {
    const bodyEl = document.querySelector("body");

    const registerBtn = document.querySelector(".register-btn");
    const attribution = document.querySelector(".attribution");
    const loginBtn = document.querySelector(".login-btn");

    registerBtn.classList.remove("hide");
    attribution.classList.remove("hide");
    bodyEl.classList.remove("absolute-bg");
    loginBtn.classList.remove("hide");

    setShowSignUp(false);
  };

  const closeSignin = () => {
    const bodyEl = document.querySelector("body");

    const registerBtn = document.querySelector(".register-btn");
    const attribution = document.querySelector(".attribution");
    const loginBtn = document.querySelector(".login-btn");

    registerBtn.classList.remove("hide");
    attribution.classList.remove("hide");
    bodyEl.classList.remove("absolute-bg");
    loginBtn.classList.remove("hide");

    setShowLogin(false);
  };

  const checkValidation = async () => {
    const errors = {};
    if (username.length < 6) {
      errors.username = "Username must be at least 6 characters.";
    }
    if (!validator.isEmail(email)) {
      errors.email = "Please enter a valid email.";
    }
    if (!validator.isStrongPassword(password)) {
      errors.password =
        "Password must be at least 8 characters, and contain at least 1 uppercase letter, 1 lowercase letter, 1 number, and atleast one special character(e.g. @$!%*#)";
    }
    setErrors(errors);
  };

  const handleSubmit = async (evt) => {
    console.log("here");
    evt.persist();
    evt.preventDefault();

    await checkValidation();
    await submitInfo();
  };

  return (
    <>
      <div>
        <article className="img-logo">
          <img className="logo" src={logo} alt="logo" />
        </article>{" "}
        <section className="logo-area">
          <h1>Secure your profile</h1>
        </section>
        <main>
          <>
            <article className="">
              {message && <p>{message}</p>}

              <button className="register-btn" onClick={register}>
                Register
              </button>

              <button className="login-btn" onClick={signin}>
                Login
              </button>
            </article>
          </>
        </main>
        {showSignUp && (
          <>
            <section className="signup">
              <div className="signup-close">
                <span onClick={closeSignUp} className="close-btn">
                  X
                </span>
              </div>
              <h3>Register</h3>
              <form action="">
                <>
                  <label htmlFor="username">
                    <p> Username:</p>

                    <input
                      className={classNames(
                        errors.username ? "errors-border" : "",
                        ""
                      )}
                      required
                      onChange={onChangeUsername}
                      type="text"
                      name="username"
                      id=""
                    />
                    <p className="text-rose">{errors.username}</p>
                  </label>
                </>
                <>
                  <label htmlFor="email">
                    <p>Email:</p>
                    <input
                      className={classNames(
                        errors.email ? "errors-border" : "",
                        ""
                      )}
                      required
                      onChange={onChangeEmail}
                      type="email"
                      name="email"
                      id=""
                    />
                    <p className="text-rose">{errors.email}</p>
                  </label>
                </>
                <>
                  <label htmlFor="password">
                    <p>Password:</p>
                    <input
                      className={classNames(
                        errors.password ? "errors-border" : "",
                        ""
                      )}
                      required
                      onChange={onChangePassword}
                      type="password"
                      name="password"
                      id=""
                    />
                    <p className="text-rose">{errors.password}</p>
                  </label>
                </>

                <button
                  // disabled={isDisabled}
                  onClick={handleSubmit}
                  type="submit"
                >
                  Submit
                </button>
              </form>
            </section>
          </>
        )}
        {showLogin && (
          <>
            <section className="login">
              <div className="login-close">
                <span onClick={closeSignin} className="close-btn">
                  X
                </span>
              </div>
              <h3>Login</h3>
              <form action="">
                <>
                  <label htmlFor="email">
                    <p>Email:</p>
                    <input
                      className={classNames(
                        errors.email ? "errors-border" : "",
                        ""
                      )}
                      required
                      onChange={onChangeEmail}
                      type="email"
                      name="email"
                      id=""
                    />
                    <p className="text-rose">{errors.email}</p>
                  </label>
                </>
                <>
                  <label htmlFor="password">
                    <p>Password:</p>
                    <input
                      className={classNames(
                        errors.password ? "errors-border" : "",
                        ""
                      )}
                      required
                      onChange={onChangePassword}
                      type="password"
                      name="password"
                      id=""
                    />
                    <p className="text-rose">{errors.password}</p>
                  </label>
                </>

                <button
                  // disabled={isDisabled}
                  onClick={handleSubmit}
                  type="submit"
                >
                  Submit
                </button>
              </form>
            </section>
          </>
        )}
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

export default Home;
