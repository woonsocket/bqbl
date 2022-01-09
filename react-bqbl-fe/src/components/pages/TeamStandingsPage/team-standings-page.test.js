import React from 'react';
import { AppStateContext } from '../../AppState';
import { FirebaseContext } from '../../Firebase';
import ScoreValue from '../../reusable/ScoreValue/score-value';
import Adapter from 'enzyme-adapter-react-16';
import { configure } from 'enzyme';
import SCORES from '../../../testdata/scores2021';
import SCORES_247 from '../../../testdata/scores-247-2021';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';

configure({ adapter: new Adapter() });

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

describe('TeamStandingsPage', () => {
  it('renders mocked data', async () => {
        render(
      <AppStateContext.Provider value={[new MockAppState()]}>
        <FirebaseContext.Provider value={new MockFirebase()}>
          <TeamStandingsPage />
        </FirebaseContext.Provider>
      </AppStateContext.Provider>
    );
    expect(screen.getByText('Learn React')).toBeInTheDocument();
    // expect(wrapper.find(ScoreValue).length).toEqual(1);
  });
});
