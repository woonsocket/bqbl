import '@testing-library/jest-dom';
import { screen } from '@testing-library/react';
import React from 'react';
import { act } from 'react';
import { MockFirebase, MOCK_APP_STATE, MockApp } from '../../../testing/mocks';
import { AppStateContext } from '../../AppState';
import { FirebaseContext } from '../../Firebase';
import TeamStandingsPage from './team-standings-page';
import { Provider } from 'react-redux';
import store from '../../../redux/store';
import { createRoot } from 'react-dom/client';

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
      createRoot(container).render(
        <AppStateContext.Provider value={[MOCK_APP_STATE]}>
          <FirebaseContext.Provider value={new MockFirebase()}>
            <MockApp year={"2023"} league={"nbqbl"}>
              <Provider store={store}>
              <TeamStandingsPage />
              </Provider>
            </MockApp>
          </FirebaseContext.Provider>
        </AppStateContext.Provider>
        )
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
