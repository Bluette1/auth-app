import { useState } from 'react';
import { useDispatch } from 'react-redux';
import logo from '../assets/logo.png';
import '../styles/Home.css';
import validator from 'validator';
import { login } from '../actions/auth';
import { useNavigate } from 'react-router-dom';
import { httpProtocol, host, port } from '../env.variables';
import { useEffect } from 'react';

const BASE_URL = `${httpProtocol}://${host}:${port}`;

const classNames = (...classes) => {
  return classes.filter(Boolean).join(' ');
};

const Home = () => {
  const [showSignUp, setShowSignUp] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [isHidden, setIsHidden] = useState(false);

  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');

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

  useEffect(() => {
    submitInfo();
  }, [errors]);

  const submitInfo = () => {
    if (Object.entries(errors).length === 0) {
      if (showSignUp) {
        try {
          const createUser = async () => {
            const response = await fetch(`${BASE_URL}/users`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                email,
                username,
                password,
              }),
            });

            if (!response.ok) {
              setMessage('Sorry an error occurred. Try again.');
              return;
            }

            setMessage('You have successfully registered.');
            const bodyEl = document.querySelector('body');

            bodyEl.classList.remove('absolute-bg');
            setIsHidden(false);

            setShowSignUp(false);
          };

          createUser();
        } catch (error) {
          console.log(error);
          return;
        }
      } else if (showLogin) {
        const loginUser = async () => {
          try {
            const response = await fetch(`${BASE_URL}/login`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                email,
                password,
              }),
            });

            if (!response.ok) {
              setMessage('Sorry an error occurred. Try again.');
              return;
            }

            const { user, token } = await response.json();

            user.token = token;
            localStorage.setItem('user', JSON.stringify(user));
            dispatch(login(user));

            setMessage('You have successfully logged in.');
            setShowLogin(false);
            navigate('/profile');
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
    const bodyEl = document.querySelector('body');

    bodyEl.classList.add('absolute-bg');
    setIsHidden(true);

    setShowSignUp(true);
  };

  const signin = () => {
    setShowLogin(true);

    const bodyEl = document.querySelector('body');

    bodyEl.classList.add('absolute-bg');
    setIsHidden(true);
  };

  const closeSignUp = () => {
    const bodyEl = document.querySelector('body');

    bodyEl.classList.remove('absolute-bg');
    setIsHidden(false);

    setShowSignUp(false);
  };

  const closeSignin = () => {
    const bodyEl = document.querySelector('body');

    bodyEl.classList.remove('absolute-bg');
    setIsHidden(false);

    setShowLogin(false);
  };

  const checkValidation = async () => {
    const errors = {};
    if (showSignUp && username.length < 6) {
      errors.username = 'Username must be at least 6 characters.';
    }
    if (!validator.isEmail(email)) {
      errors.email = 'Please enter a valid email.';
    }
    if (!validator.isStrongPassword(password)) {
      errors.password =
        'Password must be at least 8 characters, and contain at least 1 uppercase letter, 1 lowercase letter, 1 number, and atleast one special character(e.g. @$!%*#)';
    }
    setErrors(errors);
  };

  const handleSubmit = async (evt) => {
    evt.persist();
    evt.preventDefault();

    await checkValidation();
  };

  return (
    <>
      <div>
        <article className="img-logo">
          <img className="logo" src={logo} alt="logo" />
        </article>{' '}
        <section className="logo-area">
          <h1>Secure your profile</h1>
        </section>
        <main>
          <>
            <article className="">
              {message && <p>{message}</p>}

              {!isHidden && (
                <button
                  data-testid="register-btn"
                  className="register-btn"
                  onClick={register}
                >
                  Register
                </button>
              )}

              {!isHidden && (
                <button
                  data-testid="login-btn"
                  className="login-btn"
                  onClick={signin}
                >
                  Login
                </button>
              )}
            </article>
          </>
        </main>
        <>
          <section
            data-testid="register-form"
            className={classNames(showSignUp ? '' : 'hide', 'signup')}
          >
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
                      errors.username ? 'errors-border' : '',
                      ''
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
                      errors.email ? 'errors-border' : '',
                      ''
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
                      errors.password ? 'errors-border' : '',
                      ''
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

              <button onClick={handleSubmit} type="submit">
                Submit
              </button>
            </form>
          </section>
        </>
        <>
          <section
            data-testid="login-form"
            className={classNames(showLogin ? '' : 'hide', 'login')}
          >
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
                      errors.email ? 'errors-border' : '',
                      ''
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
                      errors.password ? 'errors-border' : '',
                      ''
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

              <button onClick={handleSubmit} type="submit">
                Submit
              </button>
            </form>
          </section>
        </>
        <footer>
          {!isHidden && (
            <p className="attribution">
              Design by{' '}
              <a
                href="https://portfolio-ms-app.onrender.com/"
                target="_blank"
                rel="noreferrer"
              >
                Top Weaver
              </a>
            </p>
          )}
        </footer>
      </div>
    </>
  );
};

export default Home;
