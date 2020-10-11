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
      'week': usp.get('week') || footballWeek()
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
  // console.log("week", state.week);
  return state.week;
}

function useYear() {
  let [state] = useContext(AppStateContext);
  // console.log("year", state.year);
  return state.year;
}

function useLeague() {
  let [state] = useContext(AppStateContext);
  // console.log("league", state.league);
  return state.league;
}

export { AppStateContext, useWeek, useYear, useLeague };
