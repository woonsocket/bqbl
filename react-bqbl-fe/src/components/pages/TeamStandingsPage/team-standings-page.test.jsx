import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import TeamStandingsPage from './team-standings-page';
import { SCORES } from '../../../testing/scores2021';
import { SCORES_247 } from '../../../testing/scores-247-2021';
// Mock redux hooks
jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useSelector: jest.fn(),
}));

// Mock AppState hooks
jest.mock('../../AppState/app-state', () => ({
  useWeek: () => '1',
  useYear: () => '2021',
}));

describe('TeamStandingsPage', () => {
  beforeEach(() => {
    // Setup redux mock state
    const { useSelector } = require('react-redux');
    useSelector.mockImplementation(selector => {
      const state = { scores: SCORES, scores247: SCORES_247 };
      const result = selector(state);
      return result;
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders team standings', async () => {
    render(<TeamStandingsPage />);
    // screen.logTestingPlaygroundURL();
    // Test that initial teams render
    expect(screen.getByText('ARI')).toBeInTheDocument();
    expect(screen.getByText(/118/i)).toBeInTheDocument(); // DEN's 24/7 points
    expect(screen.getByText(/[−-]500/)).toBeInTheDocument(); // DEN's week 1 score
  });
});
