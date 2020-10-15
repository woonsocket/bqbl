import React, { useContext, useState, useEffect } from 'react'
import { CURRENT_YEAR, footballWeek } from '../../constants/football'

const AppStateContext = React.createContext(null);

export const AppStateContextProvider = props => {
  const [state, setState] = useState(parseUrl());

  function parseUrl() {
    let usp = new URLSearchParams(window.location.search);
    return {
      'league': usp.get('league'),
      'year': usp.get('year') || CURRENT_YEAR,
      'week': usp.get('week') || footballWeek(),
      'uidOverride': usp.get('uidOverride') || ''
    }
  }

  useEffect(() => {
    let interval = setInterval(() => setState(parseUrl), 200);
    return () => clearInterval(interval);
  });

  return (
    <AppStateContext.Provider value={[state, setState]}>
      {props.children}
    </AppStateContext.Provider>
  );
};

function useWeek() {
  let [state] = useContext(AppStateContext);
  return state.week;
}

function useYear() {
  let [state] = useContext(AppStateContext);
  return state.year;
}

function useLeague() {
  let [state] = useContext(AppStateContext);
  return state.league;
}

function useUidOverride() {
  let [state] = useContext(AppStateContext);
  return state.uidOverride;
}

export { AppStateContext, useWeek, useYear, useLeague, useUidOverride };
