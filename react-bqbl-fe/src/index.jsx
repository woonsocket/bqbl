import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import App from './components/App';
import { AppStateContextProvider } from './components/AppState';
import Firebase, { FirebaseContext } from './components/Firebase';
import './index.css';
import { ThemeProvider, StyledEngineProvider, createTheme } from '@mui/material/styles';
import makeStyles from '@mui/styles/makeStyles';
const theme = createTheme();


ReactDOM.render(
  <FirebaseContext.Provider value={new Firebase()}>
    <Router>
      <AppStateContextProvider>
        <StyledEngineProvider injectFirst>
          <ThemeProvider theme={theme}>
            <App />
          </ThemeProvider>
        </StyledEngineProvider>
      </AppStateContextProvider>
    </Router>
  </FirebaseContext.Provider>,
  document.getElementById('root'),
);
