import React from 'react';
import { AppStateContext } from '../../AppState';
import { FirebaseContext } from '../../Firebase';
import {MockFirebase, MOCK_APP_STATE} from '../../../testing/mocks';
import '@testing-library/jest-dom';
import { render, screen, getByRole } from '@testing-library/react';
import { act } from "react-test-renderer"

import TeamScorePage from './team-score-page';

const wait = async () => new Promise((resolve) => setTimeout(resolve, 0))

describe('TeamScorePage', () => {
  it('renders mocked data', async () => {
      const {container} = render(
      <AppStateContext.Provider value={[ MOCK_APP_STATE]}>
        <FirebaseContext.Provider value={new MockFirebase()}>
          <TeamScorePage />
        </FirebaseContext.Provider>
      </AppStateContext.Provider>
    );
    await act(async() => {
      await wait()
    })
    // SUPER USEFUL
    // screen.logTestingPlaygroundURL();
    // Test that NYJ is in there, as they should be!
    expect(screen.getByRole('heading', { name: /nyj/i })).toBeInTheDocument();
  });
});
