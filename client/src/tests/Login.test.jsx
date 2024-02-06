import { it, describe, expect } from "vitest";
import {
  render,
  screen,
  waitFor,
  act,
  fireEvent,
} from "@testing-library/react";
import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";
import App from "../App.jsx";
import { BrowserRouter } from "react-router-dom";

import configureStore from "../testutils/store";
import { Provider } from "react-redux";

import { beforeAll, afterEach, afterAll } from "vitest";

const user = {
  username: "John Doe",
  email: "john.doe@gmail.com",
};

const token = "ey1223876655599JNG54667777788777";

const server = setupServer(
  http.post("http://localhost:3001/login", (req, params, cookies) => {
    return HttpResponse.json({ user, token });
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

const store = configureStore();

const AppWithStore = () => (
  <Provider store={store}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>
);

describe("App", () => {
  it("should render the App", async () => {
    render(<AppWithStore />);
    const loginBtn = screen.getByTestId("login-btn");
    expect(loginBtn).toBeInTheDocument();

    const loginForm = screen.getByTestId("login-form");
    expect(loginForm).toHaveClass("hide");

    act(() => {
      fireEvent.click(loginBtn);
    });

    expect(loginForm).not.toHaveClass("hide");
    const inputEmail = loginForm.querySelector('input[type="email"]');
    expect(inputEmail).toBeInTheDocument();

    const inputPassword = loginForm.querySelector('input[type="password"]');
    expect(inputPassword).toBeInTheDocument();

    const submitBtn = loginForm.querySelector("button");
    const loginDispatchSpy = store.dispatch;

    await act(async () => {
      fireEvent.change(inputEmail, { target: { value: "doggy@gmail.com" } });
      fireEvent.change(inputPassword, {
        target: { value: "passwordGoodOne123&" },
      });
      await fireEvent.click(submitBtn);
    });

    await waitFor(() => {
      expect(loginDispatchSpy).toHaveBeenCalled();
      expect(loginDispatchSpy).toHaveBeenCalledWith({
        payload: { user: { ...user, token } },
        type: "LOGIN",
      });
      expect(loginForm).not.toBeInTheDocument();

      const profile = screen.getByTestId("profile");
      expect(profile).toBeInTheDocument();

    });
  });
});
