import { it, describe, expect } from 'vitest';
import {
  render,
  screen,
  waitFor,
  act,
  fireEvent,
  within,
  store,
} from '../testutils/test-utils';
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import App from '../App.jsx';
import { beforeAll, afterEach, afterAll } from 'vitest';

const user = {
  username: 'John Doe',
  email: 'john.doe@gmail.com',
};

const token = 'ey1223876655599JNG54667777788777';

const server = setupServer(
  http.post('http://localhost:3001/login', () => {
    return HttpResponse.json({ user, token });
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('Authentication - Login', () => {
  it.sequential('Response errors are handled correctly', async () => {
    server.use(
      http.post('http://localhost:3001/login', () => {
        return new HttpResponse(null, { status: 401 });
      })
    );
    const app = render(<App />);
    expect(app).toMatchSnapshot();

    const loginBtn = screen.getByTestId('login-btn');
    expect(loginBtn).toBeInTheDocument();

    const loginForm = screen.getByTestId('login-form');
    expect(loginForm).toHaveClass('hide');

    act(() => {
      fireEvent.click(loginBtn);
    });

    expect(loginForm).not.toHaveClass('hide');
    const inputEmail = loginForm.querySelector('input[type="email"]');
    expect(inputEmail).toBeInTheDocument();

    const inputPassword = loginForm.querySelector('input[type="password"]');
    expect(inputPassword).toBeInTheDocument();

    const submitBtn = loginForm.querySelector('button');
    const loginDispatchSpy = store.dispatch;

    await act(async () => {
      fireEvent.change(inputEmail, { target: { value: 'doggy@gmail.com' } });
      fireEvent.change(inputPassword, {
        target: { value: 'passwordGoodOne123&' },
      });
      await fireEvent.click(submitBtn);
    });

    await waitFor(async () => {
      expect(loginDispatchSpy).not.toHaveBeenCalled();
      expect(loginForm).toBeInTheDocument();
    });
  });

  const invalidScenarios = {
    email: ['gmail.com', 'passwordGoodOne123&', 'Please enter a valid email.'],
    password: [
      'doggy@gmail.com',
      '123&',
      /Password must be at least 8 characters/i,
    ],
  };

  for (const invalidScenario in invalidScenarios) {
    it.sequential(`Form Validation works as expected - ${invalidScenario}`, async () => {
      const app = render(<App />);
      const loginBtn = screen.getByTestId('login-btn');
      expect(loginBtn).toBeInTheDocument();

      const loginForm = screen.getByTestId('login-form');
      expect(loginForm).toHaveClass('hide');

      act(() => {
        fireEvent.click(loginBtn);
      });

      const scenario = invalidScenarios[invalidScenario];
      const email = scenario[0];
      const password = scenario[1];
      const errorMessage = scenario[2];

      expect(loginForm).not.toHaveClass('hide');

      const inputEmail = loginForm.querySelector('input[type="email"]');
      expect(inputEmail).toBeInTheDocument();

      const inputPassword = loginForm.querySelector('input[type="password"]');
      expect(inputPassword).toBeInTheDocument();

      const submitBtn = loginForm.querySelector('button');
      const loginDispatchSpy = store.dispatch;

      await act(async () => {
        fireEvent.change(inputEmail, { target: { value: email } });
        fireEvent.change(inputPassword, {
          target: { value: password },
        });
        await fireEvent.click(submitBtn);
      });

      await waitFor(() => {
        expect(loginDispatchSpy).not.toHaveBeenCalled();
        expect(
          loginForm.querySelector(`input[type="${invalidScenario}"]`)
        ).toHaveClass('errors-border');
        expect(within(loginForm).getByText(errorMessage)).toBeInTheDocument();
        expect(app).toMatchSnapshot();
      });
    });
  }

  it.sequential('A user can login', async () => {
    const app = render(<App />);
    expect(app).toMatchSnapshot();

    const loginBtn = screen.getByTestId('login-btn');
    expect(loginBtn).toBeInTheDocument();

    const loginForm = screen.getByTestId('login-form');
    expect(loginForm).toHaveClass('hide');

    act(() => {
      fireEvent.click(loginBtn);
    });

    expect(loginForm).not.toHaveClass('hide');
    const inputEmail = loginForm.querySelector('input[type="email"]');
    expect(inputEmail).toBeInTheDocument();

    const inputPassword = loginForm.querySelector('input[type="password"]');
    expect(inputPassword).toBeInTheDocument();

    const submitBtn = loginForm.querySelector('button');
    const loginDispatchSpy = store.dispatch;

    await act(async () => {
      fireEvent.change(inputEmail, { target: { value: 'doggy@gmail.com' } });
      fireEvent.change(inputPassword, {
        target: { value: 'passwordGoodOne123&' },
      });
      await fireEvent.click(submitBtn);
    });

    await waitFor(async () => {
      expect(loginDispatchSpy).toHaveBeenCalled();
      expect(loginDispatchSpy).toHaveBeenCalledWith({
        payload: { user: { ...user, token } },
        type: 'LOGIN',
      });
      expect(loginForm).not.toBeInTheDocument();

      const profile = screen.getByTestId('profile');
      expect(profile).toBeInTheDocument();

      const logoutBtn = screen.getByTestId('logout-btn');
      expect(logoutBtn).toBeInTheDocument();
    });
  });

  it.sequential('A user can logout', async () => {
    const app = render(<App />);
    expect(app).toMatchSnapshot();
    const profile = screen.getByTestId('profile');
    expect(profile).toBeInTheDocument();
    const logoutBtn = screen.getByTestId('logout-btn');
    expect(logoutBtn).toBeInTheDocument();

    await act(async () => {
      fireEvent.click(logoutBtn);
    });
    expect(profile).not.toBeInTheDocument();
    expect(logoutBtn).not.toBeInTheDocument();
    const logoutDispatchSpy = store.dispatch;
    expect(logoutDispatchSpy).toHaveBeenCalledOnce();
    expect(logoutDispatchSpy).toHaveBeenCalledWith({ type: 'LOGOUT' });
  });
});
