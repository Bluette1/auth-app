import { it, describe, expect } from 'vitest';
import { render, screen, } from '@testing-library/react';
import App from '../App.jsx';
import { BrowserRouter } from 'react-router-dom';

import configureStore from '../testutils/store';
import { Provider } from 'react-redux';

const AppWithStore = () => (
  <Provider store={configureStore()}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>
);

describe('App', () => {
  it('should render the App', () => {
    const app = render(<AppWithStore />);
    expect(app).toMatchSnapshot();

    const element = screen.getByText(/secure your profile/i);
    expect(element).toBeInTheDocument();
  });
});
