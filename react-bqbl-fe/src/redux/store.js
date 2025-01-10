import { configureStore, createSlice } from '@reduxjs/toolkit'

const leagueFetchMiddleware = storeAPI => next => action => {
  if (action.firebase && action.type === 'league/set' && action.leagueId) {
    action.firebase.getLeagueSpecThen(action.leagueId, resp => {
      storeAPI.dispatch({ type: 'league/loaded', payload: resp })
    })
  }
  
  return next(action)
}


function getScoresYearThen(db, year, cb) {
  let scoresRef = db.ref(`scores/${year}`);
  let scores247Ref = db.ref(`scores247/${year}`);

  scoresRef.on("value", (scoresSnap) => {
    scores247Ref.on("value", (scores247Snap) => {
      const dbScores = scoresSnap.val();
      const dbScores247 = scores247Snap.val() || [];
      if (!dbScores) {
        throw new Error("Can't read NFL team scores");
      }
      if (!dbScores247) {
        console.log(
          "Can't read 24/7 scores. Have the quarterbacks really been that good?"
        );
      }
      cb({ dbScores, dbScores247 });
    });
  });

  return () => {
    scoresRef.off("value");
    scores247Ref.off("value");
  };
};


const scoresMiddleware = storeAPI => next => action => {
  if (action.firebase && action.type === 'scores/load') {
    getScoresYearThen(action.firebase.getDb(), action.year, resp => {
      storeAPI.dispatch({ type: 'scores/loaded', payload: resp.dbScores })
    })
  }
  
  return next(action)
}

// TODO: separate fetch for scores and 24/7 scores.
const scores247Middleware = storeAPI => next => action => {
  if (action.firebase && action.type === 'scores247/load') {
    getScoresYearThen(action.firebase.getDb(), action.year, resp => {
      storeAPI.dispatch({ type: 'scores247/loaded', payload: resp.dbScores247 })
    })
  }
  
  return next(action)
}

// TODO Update pro bowl starts middleware to handle multiple leagues
const proBowlStartsMiddleware = storeAPI => next => action => {
  if (action.firebase && action.type === 'proBowlStarts/load') {
    // Get starts for both leagues
    ['abqbl', 'nbqbl'].forEach(leagueId => {
      action.firebase.getProBowlStartsForLeagueThen(
        leagueId,
        action.year,
        (starts) => {
          storeAPI.dispatch({ 
            type: 'proBowlStarts/loaded', 
            payload: {
              league: leagueId,
              starts
            }
          });
        }
      );
    });
  }
  return next(action);
}

export const leagueSlice = createSlice({
  name: 'league',
  initialState: {
    id: 'nbqbl',
    spec: []
  },
  reducers: {
    set:(state, action) => {
      state.id = action.leagueId
    },
    loaded: (state, action) => {
      // TODO ughhhh this is terrible. it should be /leagueSpec, not league.spec.
      state.spec = action.payload
    }
  }
})

export const scoresSlice = createSlice({
  name: 'scores',
  initialState: {
  },
  reducers: {
    load:(state, action) => {},
    loaded: (state, action) => {
      return action.payload;
    }
  }
})

export const scores247Slice = createSlice({
  name: 'scores247',
  initialState: {
  },
  reducers: {
    load:(state, action) => {},
    loaded: (state, action) => action.payload
  }
})


export const yearSlice = createSlice({
  name: 'year',
  initialState: '2023',
  reducers: {
    set: (state, action) => action.year,
  }
})

export const weekSlice = createSlice({
  name: 'week',
  initialState: {
    value: '1'
  },
  reducers: {
    set: state => {
    },
  }
})

export const userSlice = createSlice({
  name: 'users',
  initialState: {
    value: ['dummy']
  },
  reducers: {
    set:(state, action) => {
      state.value = action.payload
    }
  }
})

// TODO Update pro bowl starts slice to use league-keyed object
export const proBowlStartsSlice = createSlice({
  name: 'proBowlStarts',
  initialState: {
    abqbl: [],
    nbqbl: []
  },
  reducers: {
    load: (state, action) => {},
    loaded: (state, action) => {
      state[action.payload.league] = action.payload.starts;
    }
  }
})

export const DEFAULT_REDUCERS = {
  league: leagueSlice.reducer,
  year: yearSlice.reducer,
  week: weekSlice.reducer,
  users: userSlice.reducer,
  scores: scoresSlice.reducer,
  scores247: scores247Slice.reducer,
  proBowlStarts: proBowlStartsSlice.reducer
}

export default configureStore({
  reducer: DEFAULT_REDUCERS,
  middleware: [
    leagueFetchMiddleware, 
    scoresMiddleware, 
    scores247Middleware,
    proBowlStartsMiddleware
  ],
})
