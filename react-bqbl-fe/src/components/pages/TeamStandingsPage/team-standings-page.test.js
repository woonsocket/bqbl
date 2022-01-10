import React from 'react';
import { AppStateContext } from '../../AppState';
import { FirebaseContext } from '../../Firebase';
import { MockFirebase, MOCK_APP_STATE } from '../../../testing/mocks';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import ReactDOM from 'react-dom';
import { act } from 'react-dom/test-utils';

import TeamStandingsPage from './team-standings-page';

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

describe('TeamStandingsPage', () => {
  it('renders mocked data', async () => {
    act(() => {
      ReactDOM.render(
        <AppStateContext.Provider value={[MOCK_APP_STATE]}>
          <FirebaseContext.Provider value={new MockFirebase()}>
            <TeamStandingsPage />
          </FirebaseContext.Provider>
        </AppStateContext.Provider>
        , container)
    });

    await act(async () => {
      await wait()
    })
    // Test that a team header is there
    expect(screen.getByText('ARI')).toBeInTheDocument();
    // SUPER USEFUL
    // screen.logTestingPlaygroundURL(screen.getAllByTestId('team-row')[0]);
    // Test that DEN's 24/7 points (lol) are there
    expect(screen.getByText(/118/i)).toBeInTheDocument();
    // Test that DEN's (fictional) week 1 score is there
    expect(screen.getByText(/1021/i)).toBeInTheDocument();
  });
});
