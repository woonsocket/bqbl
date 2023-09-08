import { StyledEngineProvider, ThemeProvider, createTheme } from '@mui/material/styles';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import App from './components/App';
import { AppStateContextProvider } from './components/AppState';
import Firebase, { FirebaseContext } from './components/Firebase';
import './index.css';
import store from './redux/store';
const theme = createTheme();

ReactDOM.render(
  <FirebaseContext.Provider value={new Firebase()}>
    <Router>
      <Provider store={store}>
        <AppStateContextProvider>
          <StyledEngineProvider injectFirst>
            <ThemeProvider theme={theme}>
              <App />
            </ThemeProvider>
          </StyledEngineProvider>
        </AppStateContextProvider>
      </Provider>
    </Router>
  </FirebaseContext.Provider>,
  document.getElementById('root'),
);
