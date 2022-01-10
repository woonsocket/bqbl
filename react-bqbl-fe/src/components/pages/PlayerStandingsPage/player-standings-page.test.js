import React from 'react';
import { AppStateContext } from '../../AppState';
import { FirebaseContext } from '../../Firebase';
import {MockFirebase, MOCK_APP_STATE} from '../../../testing/mocks';
import '@testing-library/jest-dom';
import { screen, getByRole } from '@testing-library/react';
import ReactDOM from 'react-dom';
import { act } from 'react-dom/test-utils';

import PlayerStandingsPage from './player-standings-page';

const wait = async () => new Promise((resolve) => setTimeout(resolve, 0))

let container;

beforeEach(() => {
  container = document.createElement('div');
  document.body.appendChild(container);
});

afterEach(() => {
  document.body.removeChild(container);
  container = null;
});

describe('PlayerStandingsPage', () => {
  it('renders mocked data', async () => {
    act(() => {
      ReactDOM.render(
      <AppStateContext.Provider value={[MOCK_APP_STATE]}>
        <FirebaseContext.Provider value={new MockFirebase()}>
          <PlayerStandingsPage />
        </FirebaseContext.Provider>
      </AppStateContext.Provider>
    , container)});
    await act(async() => {
      await wait()
    })
    // SUPER USEFUL
    // screen.logTestingPlaygroundURL();
    // screen.logTestingPlaygroundURL(screen.getAllByTestId('player-card')[0]);
    expect(screen.getByText(/cade/i)).toBeInTheDocument();
    expect(screen.getByText(/total: 1269/i)).toBeInTheDocument();
  });
});
