import React from 'react';
import { AppStateContext } from '../../AppState';
import { FirebaseContext } from '../../Firebase';
import {MockFirebase, MockAppState} from '../../../testing/mocks';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { act } from "react-test-renderer"

import TeamStandingsPage from './team-standings-page';


const wait = async () => new Promise((resolve) => setTimeout(resolve, 0))

describe('TeamStandingsPage', () => {
  it('renders mocked data', async () => {
        render(
      <AppStateContext.Provider value={[new MockAppState()]}>
        <FirebaseContext.Provider value={new MockFirebase()}>
          <TeamStandingsPage />
        </FirebaseContext.Provider>
      </AppStateContext.Provider>
    );
    await act(async() => {
      await wait()
    })
    expect(screen.getByText('ARI')).toBeInTheDocument();
  });
});
