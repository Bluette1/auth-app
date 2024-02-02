import { it, describe, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Simulate, act } from "react-dom/test-utils";
import App from "../App.jsx";
import { BrowserRouter } from "react-router-dom";

import configureStore from "../testutils/store";
import { Provider } from "react-redux";

const AppWithStore = () => (
  <Provider store={configureStore()}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>
);

describe("App", () => {
  it("should render the App", () => {
    render(<AppWithStore />);

    const buttonEl = screen.getByText(/login/i);
    expect(buttonEl).toBeInTheDocument();
    console.log('buttonEl', buttonEl)
    act(async () => {
      await fireEvent.click(buttonEl);   
      expect(screen.getByTestId("login-form")).toBeInTheDocument();

    });
  });
});
