import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import ProBowlScoresPage from './pro-bowl-score-page';
import { SCORES } from '../../../testing/scores2021';

// Mock redux hooks
jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useSelector: jest.fn(),
  useDispatch: jest.fn(),
}));

// Mock AppState hooks
jest.mock('../../AppState/app-state', () => ({
  useYear: () => '2023',
  useWeek: () => '1'
}));

const mockDispatch = jest.fn();

describe('ProBowlScoresPage', () => {
  beforeEach(() => {
    const { useSelector, useDispatch } = require('react-redux');
    
    // Setup redux mock state
    useSelector.mockImplementation(selector => {
      const state = { 
        scores: SCORES,
        proBowlStarts: {
          nbqbl: [
            {
              name: 'Ryan',
              id: 'QB1',
              starts: ['DEN'],
            },
            {
              name: 'Trevor',
              id: 'QB2',
              starts: ['JAX'],
            }
          ],
          abqbl: [
            {
              name: 'Aaron',
              id: 'QB3',
              starts: ['GB'],
            }
          ]
        }
      };
      
      const result = selector(state);
      return result;
    });

    useDispatch.mockImplementation(() => mockDispatch);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders pro bowl scores for all leagues', async () => {
    render(<ProBowlScoresPage />);

    screen.logTestingPlaygroundURL();
    // Test that league cards render
    expect(screen.getByText('nbqbl')).toBeInTheDocument();
    expect(screen.getByText('abqbl')).toBeInTheDocument();

    // Test that QB names render for both leagues
    expect(screen.getByText('Ryan')).toBeInTheDocument();
    expect(screen.getByText('Trevor')).toBeInTheDocument();
    expect(screen.getByText('Aaron')).toBeInTheDocument();

    // Test that scores render
    expect(screen.getByText(/total: -493/i)).toBeInTheDocument(); // nbqbl league total (-500+7)

    // Test that teams render
    expect(screen.getAllByText(/[−-]500/i)).toHaveLength(2);
  });

  it('dispatches load action on mount', () => {
    render(<ProBowlScoresPage />);

    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'proBowlStarts/load',
      firebase: expect.any(Object),
      year: '2023'
    });
  });
});
