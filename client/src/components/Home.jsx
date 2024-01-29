import { useState, useEffect } from "react";
import logo from "../assets/logo.png";
import "../styles/Home.css";
import validator from "validator";

const classNames = (...classes) => {
  return classes.filter(Boolean).join(" ");
};

const Home = () => {
  const [showSignUp, setShowSignUp] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [disabled, setDisabled] = useState(true);

  const onChangeEmail = ({ target: { value } }) => {
    setEmail(value);
  };

  const onChangeUsername = ({ target: { value } }) => {
    setUsername(value);
  };

  const onChangePassword = ({ target: { value } }) => {
    setPassword(value);
  };

  const register = () => {
    const bodyEl = document.querySelector("body");
    const registerBtn = document.querySelector(".register-btn");
    const attribution = document.querySelector(".attribution");

    bodyEl.classList.add("absolute-bg");
    registerBtn.classList.add("hide");
    attribution.classList.add("hide");

    setShowSignUp(true);
  };

  const closeSignUp = () => {
    const registerBtn = document.querySelector(".register-btn");
    const attribution = document.querySelector(".attribution");

    registerBtn.classList.remove("hide");
    attribution.classList.remove("hide");

    setShowSignUp(false);
  };

  const checkValidation = async () => {
    const errors = {};
    console.log("Username---------------------------------", username);

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
    console.log("((((((((((((((((((((()))))))))))))))))))))");
    evt.persist();
    evt.preventDefault();

    await checkValidation();
  };

  useEffect(() => {
    if (disabled) {
      setDisabled(false);
    } else {
      if (Object.entries(errors).length === 0 && !disabled) {
        const createUser = async () => {
          await fetch(`${import.meta.env.BASE_URL}/users`, {
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
          signIn(undefined, { callbackUrl: "/" });
        };
        createUser();
      }
    }
  }, [errors]);

  return (
    <>
      <div>
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
              <button className="register-btn" onClick={register}>
                Login
              </button>
            </article>
          </>
        </main>
        {showSignUp && (
          <>
            <section className="signup">
              <div className="signup-close">
                <span onClick={closeSignUp} id="close-btn">
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
                  disabled={disabled}
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
