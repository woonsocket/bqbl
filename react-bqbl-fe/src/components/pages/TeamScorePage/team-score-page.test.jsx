import React from 'react';
import { render, screen, within } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import TeamScorePage from './team-score-page';
import {SCORES} from '../../../testing/scores2021';
import { act } from '@testing-library/react';

// Mock redux hooks
jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useSelector: jest.fn(),
}));

// Mock AppState hooks
jest.mock('../../AppState', () => ({
  useWeek: () => '1',
  useYear: () => '2023',
}));

describe('TeamScorePage', () => {

  beforeEach(() => {
    // Setup redux mock state
    const { useSelector } = require('react-redux');
    useSelector.mockImplementation(selector => {
      const state = { scores: SCORES };
      const result = selector(state);
      return result;
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders scores', async () => {
    render(<TeamScorePage week="1" />);

    // Test that initial render
    expect(screen.getByText('NE')).toBeInTheDocument();
    expect(screen.getByText('NYJ')).toBeInTheDocument();
  });

  it('renders scores and allows sorting', async () => {
    // The mocked scores are edited such that BUF is first with projections, and ATL is first
    // without projections. Alphabetically, ARI is first.

    render(<TeamScorePage week="1" />);

    // screen.logTestingPlaygroundURL();

    // Test initial render (sorted by team and projections, BUF first)
    let firstRow = screen.getAllByRole('heading')[0];
    expect(firstRow).toHaveTextContent('BUF');

    // Disable sort by projections, making ATL first
    const projectionsSwitch = screen.getByTestId('projections-toggle');
    const projectionsSwitchInput = within(projectionsSwitch).getByRole('checkbox');
    expect(projectionsSwitchInput).toBeChecked();

    await act(async () => {
      await userEvent.click(projectionsSwitchInput);
      // Add small delay to let state updates propagate
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    expect(projectionsSwitchInput).not.toBeChecked();
    firstRow = screen.getAllByRole('heading')[0];
    expect(firstRow).toHaveTextContent('ATL');

    // Disable sort overall
    const sortSwitch = screen.getByTestId('sort-toggle');
    const switchInput = within(sortSwitch).getByRole('checkbox');
    expect(switchInput).toBeChecked();

    await act(async () => {
      await userEvent.click(switchInput);
      // Add small delay to let state updates propagate
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    expect(switchInput).not.toBeChecked();
    // Verify sort changed
    firstRow = screen.getAllByRole('heading')[0];
    expect(firstRow).toHaveTextContent('ARI');
  });
});
