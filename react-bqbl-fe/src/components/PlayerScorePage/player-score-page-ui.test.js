/* eslint-disable no-undef */
import React from 'react';
import '@testing-library/jest-dom';
import { render } from '@testing-library/react'

import ScoreJoiner from '../ScoreJoiner/score-joiner';
import Firebase from '../Firebase';

import PlayerScorePageUI from './player-score-page-ui';
import SCORES_WEEK from './scores-week';
import STARTS from './starts';

let container;

beforeEach(() => {
  container = document.createElement('div');
  document.body.appendChild(container);
});

afterEach(() => {
  document.body.removeChild(container);
  container = null;
});

it('renders', () => {
  let firebase = new Firebase();
  let scoreJoiner = new ScoreJoiner(firebase, "2018", "02")
  scoreJoiner.mergeData(SCORES_WEEK, STARTS);
  const { getByText } = render(<PlayerScorePageUI playerList={STARTS}/>);
  expect(getByText(/^Joel/).textContent).toContain('Joel')
});