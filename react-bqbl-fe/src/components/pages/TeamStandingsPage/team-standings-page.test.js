import React from 'react';
import { AppStateContext } from '../../AppState';
import { FirebaseContext } from '../../Firebase';
import SCORES from '../../../testdata/scores2021';
import SCORES_247 from '../../../testdata/scores-247-2021';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { act } from "react-test-renderer"

import TeamStandingsPage from './team-standings-page';

class MockFirebase {
  getScoresYear(year) {
    return [new Promise((resolve, reject) =>
      resolve({ dbScores: SCORES, dbScores247: SCORES_247 })
    ), a => a];
  }
}

function MockAppState() {

}

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
