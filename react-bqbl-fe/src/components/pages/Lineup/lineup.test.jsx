import React from 'react';
import { AppStateContext } from '../../AppState';
import { FirebaseContext } from '../../Firebase';
import {MockFirebase, MOCK_APP_STATE} from '../../../testing/mocks';
import '@testing-library/jest-dom';
import { act } from 'react-dom/test-utils';
import { render, screen } from '@testing-library/react';
import { afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { Provider } from 'react-redux';

import LineupPage from './lineup';
import store from '../../../redux/store';

const wait = async () => new Promise((resolve) => setTimeout(resolve, 0))

let container;

beforeEach(() => {
  container = document.createElement('div');
  document.body.appendChild(container);
});


// runs a cleanup after each test case (e.g. clearing jsdom)
afterEach(() => {
  cleanup();
});

describe('LineupPage', () => {
  it('renders mocked data', async () => {
    act(() => {
      render(
      <AppStateContext.Provider value={[MOCK_APP_STATE]}>
        <FirebaseContext.Provider value={new MockFirebase()}>
        <Provider store={store}>
          <LineupPage />
        </Provider>
        </FirebaseContext.Provider>
      </AppStateContext.Provider>
    , container)});
    await act(async() => {
      await wait()
    })
    // SUPER USEFUL
    // screen.logTestingPlaygroundURL();
    // screen.logTestingPlaygroundURL(screen.getAllByTestId('player-card')[0]);
    // TODO: Make this a real test by doing a mock App component that kicks off hte right data fetches.
    // expect(screen.getByText(/cade/i)).toBeInTheDocument();
  });
});
