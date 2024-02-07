import { it, describe, expect } from 'vitest';
import {
  render,
  screen,
  waitFor,
  act,
  fireEvent,
  within,
} from '@testing-library/react';
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import App from '../App.jsx';
import { BrowserRouter } from 'react-router-dom';

import configureStore from '../testutils/store';
import { Provider } from 'react-redux';
import { beforeAll, afterEach, afterAll } from 'vitest';

const user = {
  username: 'John Doe',
  email: 'john.doe@gmail.com',
};

const server = setupServer(
  http.post('http://localhost:3001/users', (req, params, cookies) => {
    return HttpResponse.json(user);
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

describe('Authentication - Signup', () => {
  it.sequential('Form Validation works as expected', async () => {
    const app = render(<AppWithStore />);
    const registerBtn = screen.getByTestId('register-btn');
    expect(registerBtn).toBeInTheDocument();

    const registerForm = screen.getByTestId('register-form');
    expect(registerForm).toHaveClass('hide');

    act(() => {
      fireEvent.click(registerBtn);
    });

    expect(registerForm).not.toHaveClass('hide');

    const inputUsername = registerForm.querySelector('input[type="text"]');
    expect(inputUsername).toBeInTheDocument();
    const inputEmail = registerForm.querySelector('input[type="email"]');
    expect(inputEmail).toBeInTheDocument();

    const inputPassword = registerForm.querySelector('input[type="password"]');
    expect(inputPassword).toBeInTheDocument();

    const submitBtn = registerForm.querySelector('button');

    await act(async () => {
      fireEvent.change(inputUsername, { target: { value: 'doggy' } });

      fireEvent.change(inputEmail, { target: { value: 'gmail.com' } });
      fireEvent.change(inputPassword, {
        target: { value: '123&' },
      });
      await fireEvent.click(submitBtn);
    });

    await waitFor(() => {
      expect(inputUsername).toHaveClass('errors-border');

      expect(inputEmail).toHaveClass('errors-border');

      expect(inputPassword).toHaveClass('errors-border');
      expect(
        within(registerForm).getByText(
          'Username must be at least 6 characters.'
        )
      ).toBeInTheDocument();
      expect(
        within(registerForm).getByText('Please enter a valid email.')
      ).toBeInTheDocument();
      expect(
        within(registerForm).getByText(
          /Password must be at least 8 characters/i
        )
      ).toBeInTheDocument();
      expect(app).toMatchSnapshot();
    });
  });

  it.sequential('A user can sign up', async () => {
    const app = render(<AppWithStore />);
    expect(app).toMatchSnapshot();

    const registerBtn = screen.getByTestId('register-btn');
    expect(registerBtn).toBeInTheDocument();

    const registerForm = screen.getByTestId('register-form');
    expect(registerForm).toHaveClass('hide');

    act(() => {
      fireEvent.click(registerBtn);
    });

    expect(registerForm).not.toHaveClass('hide');

    const inputUsername = registerForm.querySelector('input[type="text"]');
    expect(inputUsername).toBeInTheDocument();

    const inputEmail = registerForm.querySelector('input[type="email"]');
    expect(inputEmail).toBeInTheDocument();

    const inputPassword = registerForm.querySelector('input[type="password"]');
    expect(inputPassword).toBeInTheDocument();

    const submitBtn = registerForm.querySelector('button');

    await act(async () => {
      fireEvent.change(inputUsername, {
        target: { value: 'dogggy@gmail.com' },
      });

      fireEvent.change(inputEmail, { target: { value: 'doggy@gmail.com' } });
      fireEvent.change(inputPassword, {
        target: { value: 'passwordGoodOne123&' },
      });
      await fireEvent.click(submitBtn);
    });

    await waitFor(() => {
      expect(
        screen.getByText('You have successfully registered.')
      ).toBeInTheDocument();
      expect(registerForm).toHaveClass('hide');

      expect(app).toMatchSnapshot();
    });
  });
});
