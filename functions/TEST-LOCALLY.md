export GOOGLE_APPLICATION_CREDENTIALS=../private-keys/bqbl-591f3-f7f1062e9016.json 
firebase functions:shell

# Shell recipes
draftTeam({team:'den', league:'rbqbl', uidOverride:'4', year: '2019'})
createLeague({league: 'rbqbl'})
setDraftOrder({league: 'abqbl', year: '2019'})

# Sets things up such that all users have joined the league, ready to call setDraftOrder
tmpWriteLeague({league: 'abqbl', year: '2019'})