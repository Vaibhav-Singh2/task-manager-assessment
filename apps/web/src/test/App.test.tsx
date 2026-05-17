import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { App } from '../App';
import { store } from '../store/store';

describe('App', () => {
  it('renders auth page when unauthenticated', () => {
    localStorage.clear();
    const { getByText } = render(
      <Provider store={store}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </Provider>
    );

    expect(getByText(/welcome back/i)).toBeInTheDocument();
  });
});
