import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import App from './components/App';
import { AppStateContextProvider } from './components/AppState';
import Firebase, { FirebaseContext } from './components/Firebase';
import './index.css';


ReactDOM.render(
  <FirebaseContext.Provider value={new Firebase()}>
    <Router>
      <AppStateContextProvider>
        <App />
        </AppStateContextProvider>
    </Router>
  </FirebaseContext.Provider>,
  document.getElementById('root'),
);
