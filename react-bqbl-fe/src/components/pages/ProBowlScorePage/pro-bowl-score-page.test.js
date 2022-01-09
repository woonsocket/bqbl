import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { act } from "react-test-renderer";
import { MockFirebase, MOCK_APP_STATE } from '../../../testing/mocks';
import { AppStateContext } from '../../AppState';
import { FirebaseContext } from '../../Firebase';
import ProBowlScoresPage from './pro-bowl-score-page';


const wait = async () => new Promise((resolve) => setTimeout(resolve, 0))

describe('ProBowlScoresPage', () => {
  it('renders mocked data', async () => {
      const {container} = render(
      <AppStateContext.Provider value={[MOCK_APP_STATE]}>
        <FirebaseContext.Provider value={new MockFirebase()}>
          <ProBowlScoresPage />
        </FirebaseContext.Provider>
      </AppStateContext.Provider>
    );
    await act(async() => {
      await wait()
    })
    // SUPER USEFUL
    screen.logTestingPlaygroundURL();
    // screen.logTestingPlaygroundURL(screen.getAllByTestId('player-card')[0]);
    expect(screen.getByText(/Ryan/i)).toBeInTheDocument();
    expect(screen.getByText(/Trevor/i)).toBeInTheDocument();
    expect(screen.getAllByText(/total: 161/i)[0]).toBeInTheDocument();
    expect(screen.getAllByText(/total: 29/i)[0]).toBeInTheDocument();
  });
});
