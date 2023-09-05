import '@testing-library/jest-dom';
import { screen } from '@testing-library/react';
import React from 'react';
import ReactDOM from 'react-dom';
import { act } from 'react-dom/test-utils';
import { MockFirebase, MOCK_APP_STATE } from '../../../testing/mocks';
import { AppStateContext } from '../../AppState';
import { FirebaseContext } from '../../Firebase';
import TeamScorePage from './team-score-page';


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

describe('TeamScorePage', () => {
  it('renders mocked data', async () => {
    act(() => {
      ReactDOM.render(
        <AppStateContext.Provider value={[MOCK_APP_STATE]}>
          <FirebaseContext.Provider value={new MockFirebase()}>
            <TeamScorePage />
          </FirebaseContext.Provider>
        </AppStateContext.Provider>
        , container);
    });
    await act(async () => {
      await wait()
    })
    // SUPER USEFUL
    // screen.logTestingPlaygroundURL();
    // Test that NYJ is in there, as they should be!
    expect(screen.getByRole('heading', { name: /nyj/i })).toBeInTheDocument();
    expect(screen.getByText(/17\/29, 151 yd, 1 td, 3 int final/i)).toBeInTheDocument();
  });
});
