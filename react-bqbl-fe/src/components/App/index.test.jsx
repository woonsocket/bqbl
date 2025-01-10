import React from 'react';
import { render } from '@testing-library/react';
import App from './index';
import { FirebaseContext } from '../Firebase';
import { AppStateContextProvider } from '../AppState';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { leagueSlice } from '../../redux/store';

const mockFirebase = {
  getAllLeagues: () => ['testLeague'],
  getLeagueSpecThen: jest.fn(),
  getDb: () => ({
    ref: () => ({
      on: jest.fn(),
      off: jest.fn()
    })
  })
};

const store = configureStore({
  reducer: {
    league: leagueSlice.reducer
  }
});

const wrapper = ({ children }) => (
  <Provider store={store}>
    <FirebaseContext.Provider value={mockFirebase}>
      <AppStateContextProvider>
        <BrowserRouter>
          {children}
        </BrowserRouter>
      </AppStateContextProvider>
    </FirebaseContext.Provider>
  </Provider>
);

test('renders without crashing', () => {
  render(wrapper(<App />));
});
