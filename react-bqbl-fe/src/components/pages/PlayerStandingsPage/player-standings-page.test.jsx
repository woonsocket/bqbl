import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import PlayerStandingsPage from './player-standings-page';
import userEvent from '@testing-library/user-event';
import { act } from '@testing-library/react';

// Mock redux hooks
jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useSelector: jest.fn(),
}));

// Mock AppState hooks
jest.mock('../../AppState/app-state', () => ({
  useYear: () => '2023',
  useLeague: () => 'test-league',
}));

const MOCK_JOINED_DATA = {
  'Trevor Lawrence': {
    name: 'Trevor Lawrence', 
    total: 892,
    teams: [
      { name: 'JAX', score247: 89 },
      { name: 'TEN', score247: 65 }
    ],
    start_rows: {
      '1': {
        team_1: { team_name: 'JAX', score: 400 },
        team_2: { team_name: 'TEN', score: 200 }
      }
    }
  },
  'Jameis Winston': {
    name: 'Jameis Winston',
    total: 1269,
    teams: [
      { name: 'DEN', score247: 118 },
      { name: 'NYJ', score247: 42 }
    ],
    start_rows: {
      '1': {
        team_1: { team_name: 'DEN', score: -500 },
        team_2: { team_name: 'NYJ', score: 300 }
      }
    }
  }
};

describe('PlayerStandingsPage', () => {
  beforeEach(() => {
    // Setup redux mock state
    const { useSelector } = require('react-redux');
    useSelector.mockImplementation(selector => {
      return MOCK_JOINED_DATA;
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders player standings', async () => {
    render(<PlayerStandingsPage />);
    // screen.logTestingPlaygroundURL();
    // Test that player card renders
    expect(screen.getByText('Jameis Winston')).toBeInTheDocument();
    expect(screen.getByText('Total: 1269')).toBeInTheDocument();
    
    // Test that 24/7 scores render
    expect(screen.getByText(/118/)).toBeInTheDocument();
    
    // Test that week scores render
    expect(screen.getAllByText('Week 1')).toHaveLength(2);
    expect(screen.getByText(/[−-]500/)).toBeInTheDocument();

    // Test that Jameis appears first (highest score)
    const playerCards = screen.getAllByTestId('player-card-header');
    expect(playerCards[0]).toHaveTextContent('Jameis Winston');
  });

  it('allows sorting toggle', async () => {
    render(<PlayerStandingsPage />);

    // screen.logTestingPlaygroundURL();

    // Find and click sort switch
    const sortSwitch = screen.getByRole('checkbox');
    expect(sortSwitch).toBeChecked();

    await act(async () => {
      await userEvent.click(sortSwitch);
    });

    expect(sortSwitch).not.toBeChecked();

    // Test that Trevor appears first (alphabetical order)
    const playerCards = screen.getAllByTestId('player-card-header');
    expect(playerCards[0]).toHaveTextContent('Trevor Lawrence');
  });
});
