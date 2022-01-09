import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import App from './components/App';
import { AppStateContextProvider } from './components/AppState';
import Firebase, { FirebaseContext } from './components/Firebase';
import './index.css';
import { ThemeProvider, createMuiTheme, makeStyles } from '@material-ui/core/styles';
const theme = createMuiTheme();


ReactDOM.render(
  <FirebaseContext.Provider value={new Firebase()}>
    <Router>
      <AppStateContextProvider>
        <ThemeProvider theme={theme}>
          <App />
        </ThemeProvider>
      </AppStateContextProvider>
    </Router>
  </FirebaseContext.Provider>,
  document.getElementById('root'),
);
