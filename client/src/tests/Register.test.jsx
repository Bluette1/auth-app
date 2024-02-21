import { it, describe, expect } from 'vitest';
import {
  render,
  screen,
  waitFor,
  act,
  fireEvent,
  within,
} from '../testutils/test-utils';
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import App from '../App.jsx';
import { beforeAll, afterEach, afterAll } from 'vitest';

const user = {
  username: 'John Doe',
  email: 'john.doe@gmail.com',
};

const server = setupServer(
  http.post('http://localhost:3001/users', () => {
    return HttpResponse.json(user);
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('Authentication - Signup', () => {
  it.sequential('Response errors are handled correctly', async () => {
    server.use(
      http.post('http://localhost:3001/users', () => {
        return new HttpResponse(null, { status: 400 });
      })
    );

    const app = render(<App />);
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
      expect(screen.getByText(/Sorry an error occurred./i)).toBeInTheDocument();
      expect(registerForm).not.toHaveClass('hide');
      expect(app).toMatchSnapshot();
    });
  });

  const invalidScenarios = {
    text: ['doggy', 'doggy@gmail.com', 'passwordGoodOne123&', 'Username must be at least 6 characters.'],
    email: ['dogggy', 'gmail.com', 'passwordGoodOne123&', 'Please enter a valid email.'],
    password: [
      'dogggy',
      'doggy@gmail.com',
      '123&',
      /Password must be at least 8 characters/i,
    ],
  };

  for (const invalidScenario in invalidScenarios) {
    it.sequential('Form Validation works as expected', async () => {
      const app = render(<App />);
      expect(app).toMatchSnapshot();

      const registerBtn = screen.getByTestId('register-btn');
      expect(registerBtn).toBeInTheDocument();
  
      const registerForm = screen.getByTestId('register-form');
      expect(registerForm).toHaveClass('hide');
  
      act(() => {
        fireEvent.click(registerBtn);
      });

      const scenario = invalidScenarios[invalidScenario];
      const username = scenario[0];

      const email = scenario[1];
      const password = scenario[2];
      const errorMessage = scenario[3];
  
      expect(registerForm).not.toHaveClass('hide');
  
      const inputUsername = registerForm.querySelector('input[type="text"]');
      expect(inputUsername).toBeInTheDocument();
      const inputEmail = registerForm.querySelector('input[type="email"]');
      expect(inputEmail).toBeInTheDocument();
  
      const inputPassword = registerForm.querySelector('input[type="password"]');
      expect(inputPassword).toBeInTheDocument();
      const submitBtn = registerForm.querySelector('button');
  
      await act(async () => {
        fireEvent.change(inputUsername, { target: { value: username } });
        fireEvent.change(inputEmail, { target: { value: email } });
        fireEvent.change(inputPassword, {
          target: { value: [password] },
        });
        await fireEvent.click(submitBtn);
      });
  
      await waitFor(() => {
        expect(
          registerForm.querySelector(`input[type="${invalidScenario}"]`)
        ).toHaveClass('errors-border');

        expect(
          within(registerForm).getByText(
            errorMessage
          )
        ).toBeInTheDocument();
      });
    });
  
  }

  it.sequential('A user can sign up', async () => {
    const app = render(<App />);
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
