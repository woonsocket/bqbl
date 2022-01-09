import React from 'react';
import { AppStateContext } from '../../AppState';
import { FirebaseContext } from '../../Firebase';
import {MockFirebase, MOCK_APP_STATE} from '../../../testing/mocks';
import '@testing-library/jest-dom';
import { render, screen, getByRole } from '@testing-library/react';
import { act } from "react-test-renderer"

import PlayerStandingsPage from './player-standings-page';

const wait = async () => new Promise((resolve) => setTimeout(resolve, 0))

describe('PlayerStandingsPage', () => {
  it('renders mocked data', async () => {
      const {container} = render(
      <AppStateContext.Provider value={[MOCK_APP_STATE]}>
        <FirebaseContext.Provider value={new MockFirebase()}>
          <PlayerStandingsPage />
        </FirebaseContext.Provider>
      </AppStateContext.Provider>
    );
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
