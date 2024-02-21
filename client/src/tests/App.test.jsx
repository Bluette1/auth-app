import { it, describe, expect } from 'vitest';
import { render, screen } from '../testutils/test-utils';
import App from '../App.jsx';

describe('App', () => {
  it('should render the App', () => {
    const app = render(<App />);
    expect(app).toMatchSnapshot();

    const element = screen.getByText(/secure your profile/i);
    expect(element).toBeInTheDocument();
  });
});
