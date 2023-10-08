import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import App from './components/App';
import { AppStateContextProvider } from './components/AppState';
import Firebase, { FirebaseContext } from './components/Firebase';
import './index.css';
import store from './redux/store';

const container = document.getElementById('root');

createRoot(container).render(
  <FirebaseContext.Provider value={new Firebase()}>
    <Router>
      <Provider store={store}>
        <AppStateContextProvider>
          <App />
        </AppStateContextProvider>
      </Provider>
    </Router>
  </FirebaseContext.Provider>
  );
