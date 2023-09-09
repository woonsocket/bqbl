import { configureStore, createSlice } from '@reduxjs/toolkit'

const leagueFetchMiddleware = storeAPI => next => action => {
  if (action.firebase && action.type === 'league/set' && action.leagueId) {
    action.firebase.getLeagueSpecThen(action.leagueId, resp => {
      storeAPI.dispatch({ type: 'league/loaded', payload: resp })
    })
  }
  
  return next(action)
}

const scoresMiddleware = storeAPI => next => action => {
  if (action.firebase && action.type === 'scores/load') {
    action.firebase.getScoresYearThen(action.year, resp => {
      storeAPI.dispatch({ type: 'scores/loaded', payload: resp })
    })
  }
  
  return next(action)
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
      state.spec = action.payload
    }
  }
})

export const scores = createSlice({
  name: 'scores',
  initialState: {
    spec: []
  },
  reducers: {
    set:(state, action) => {
      state.id = action.leagueId
    },
    loaded: (state, action) => {
      state.spec = action.payload
    }
  }
})


export const yearSlice = createSlice({
  name: 'year',
  initialState: {
    value: '2023'
  },
  reducers: {
    set: state => {
    },
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

export default configureStore({
  reducer: {
    league: leagueSlice.reducer,
    year: yearSlice.reducer,
    week: weekSlice.reducer,
    users: userSlice.reducer
  },
  middleware: [leagueFetchMiddleware],
})
