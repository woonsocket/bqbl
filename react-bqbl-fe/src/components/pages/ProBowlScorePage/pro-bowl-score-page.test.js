import '@testing-library/jest-dom';
import { screen } from '@testing-library/react';
import React from 'react';
import { MockFirebase, MOCK_APP_STATE } from '../../../testing/mocks';
import { AppStateContext } from '../../AppState';
import { FirebaseContext } from '../../Firebase';
import ProBowlScoresPage from './pro-bowl-score-page';
import ReactDOM from 'react-dom';
import { act } from 'react-dom/test-utils';


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

describe('ProBowlScoresPage', () => {
  it('renders mocked data', async () => {
    act(() => {
      ReactDOM.render(      <AppStateContext.Provider value={[MOCK_APP_STATE]}>
        <FirebaseContext.Provider value={new MockFirebase()}>
          <ProBowlScoresPage />
        </FirebaseContext.Provider>
      </AppStateContext.Provider>
, container);
    });
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
