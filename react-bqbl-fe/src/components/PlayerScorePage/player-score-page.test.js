/* eslint-disable no-undef */
import React from 'react';
import '@testing-library/jest-dom';
import { Router } from 'react-router-dom'
import { render } from '@testing-library/react'
import { createMemoryHistory } from 'history'

import PlayerScorePageBase from './player-score-page';
import Firebase, { FirebaseContext } from '../Firebase';

let container;

beforeEach(() => {
  container = document.createElement('div');
  document.body.appendChild(container);
});

afterEach(() => {
  document.body.removeChild(container);
  container = null;
});

//https://testing-library.com/docs/example-react-router

function renderWithRouterAndFirebase(ui) {
  const route = '/';
  const history = createMemoryHistory({ initialEntries: [route] });

  return render((
    <Router history={history}>
      <FirebaseContext.Provider value={new Firebase()}>
        {ui}
      </FirebaseContext.Provider>
    </Router>
  ));
}

it('renders', () => {
  const { getByText } = renderWithRouterAndFirebase(<PlayerScorePageBase />)

});
