/* eslint-disable no-undef */
import React from 'react';
import '@testing-library/jest-dom';
import { render } from '@testing-library/react'

import WeekTeamRow from './week-team';

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
  const week = {starts: [{name: "NYJ", total: 6}]};
  const weekId = "1";
  const { getByText } = render(<WeekTeamRow week={week} weekId={weekId} />);
  expect(getByText(/^Week/).textContent).toContain('Week 1')
});