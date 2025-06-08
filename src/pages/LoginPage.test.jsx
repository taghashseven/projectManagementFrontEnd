import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import configureStore from 'redux-mock-store';
import LoginPage from './LoginPage';

// Create a mock redux store
const mockStore = configureStore([]);
const initialState = {
  auth: {
    loading: false,
    error: null,
    token: null,
  },
};

describe('LoginPage', () => {
  let store;

  beforeEach(() => {
    store = mockStore(initialState);

    // Mock dispatch to capture actions
    store.dispatch = vi.fn();
  });

  it('renders login form', () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <LoginPage />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
  });

  it('dispatches loginUser action on form submit', () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <LoginPage />
        </MemoryRouter>
      </Provider>
    );

    fireEvent.change(screen.getByLabelText(/email address/i), {
      target: { value: 'test@example.com' },
    });

    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'password123' },
    });

    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

    expect(store.dispatch).toHaveBeenCalledTimes(1);
    expect(store.dispatch).toHaveBeenCalledWith({
      type: 'auth/loginUser', // The actual action type depends on your slice setup
      payload: { email: 'test@example.com', password: 'password123' },
    });
  });
});
