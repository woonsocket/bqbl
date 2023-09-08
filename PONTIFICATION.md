## Pontification

# ancient history
* Isolate DB reads and writes into services
* The DB --> template boundary, and thus the Service --> View boundary should be entirely typed in structs
* We should have one file collecting all of the db-coupled structs, and one file collecting all of the template-coupled structs.

# 9/8/23 
* the above is somewhat true but is reinventing redux and similar libraries
* all components should render directly out of redux state
* db fetching and data coupling should happen in a redux middleware layer
* seems like a general principle is that anything affecting a db path should be encapsulated in our redux store?
** leagueId, week, year should all be redux properties
** dispatching events that change league, week, year should trigger re-fetches and re-joins of data

* TODO: Does dependency-injecting the firebase object into the redux layer make sense?

# what read/write patterns do we have?
* league, user, year --> all starts
* year (week?) --> all team scores
* league --> all users
* league, user, year --> write starts