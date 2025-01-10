import React from 'react';
import { render, screen, within } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import Lineup from './lineup';
import { act } from '@testing-library/react';
import { FirebaseContext } from '../../Firebase';

// Mock redux hooks
jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useSelector: jest.fn(),
}));

// Mock AppState hooks
jest.mock('../../AppState/app-state', () => ({
  useYear: () => '2023',
  useLeague: () => 'test-league',
  useUidOverride: () => null
}));

// Mock Firebase hooks and context
jest.mock('../../Firebase/firebase', () => ({
  useUser: () => ({ uid: 'test-user' })
}));

const mockUpdateStartsRow = jest.fn().mockResolvedValue();
const mockGetLockedWeeksThen = jest.fn().mockImplementation((year, now, callback) => {
  callback(new Set(['1']));
  return () => {};
});

const mockFirebase = {
  updateStartsRow: mockUpdateStartsRow,
  getLockedWeeksThen: mockGetLockedWeeksThen
};

describe('Lineup', () => {
  beforeEach(() => {
    // Setup redux mock state
    const { useSelector } = require('react-redux');
    useSelector.mockImplementation(selector => {
      const state = {
        league: {
          spec: {
            plays: {
              '2023': {
                'test-user': [
                  {
                    id: '1',
                    teams: [
                      { name: 'ARI', selected: false },
                      { name: 'ATL', selected: false },
                      { name: 'BAL', selected: false },
                      { name: 'BUF', selected: true }
                    ]
                  }
                ]
              }
            }
          }
        }
      };
      return selector(state);
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders lineup table', async () => {
    render(
      <FirebaseContext.Provider value={mockFirebase}>
        <Lineup />
      </FirebaseContext.Provider>
    );

    // screen.logTestingPlaygroundURL();
    // Test that initial teams render
    expect(screen.getByRole('cell', {name: /ARI/i})).toBeInTheDocument();
    expect(screen.getByRole('cell', {name: /ATL/i})).toBeInTheDocument();
    expect(screen.getByRole('cell', {name: /BAL/i})).toBeInTheDocument();
    expect(screen.getByRole('cell', {name: /BUF/i})).toBeInTheDocument();
  });

  it('allows team selection and updates Firebase', async () => {
    render(
      <FirebaseContext.Provider value={mockFirebase}>
        <Lineup />
      </FirebaseContext.Provider>
    );

    // Find and click an unselected team cell (ARI)
    const cells = screen.getAllByRole('cell');
    const ariCell = cells.find(cell => cell.textContent.includes('ARI'));
    
    await act(async () => {
      await userEvent.click(ariCell);
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    // Verify Firebase update was called
    expect(mockUpdateStartsRow).toHaveBeenCalled();
    
    // Verify locked week shows lock icon
    expect(screen.getByTitle('week is locked')).toBeInTheDocument();
  });
});
