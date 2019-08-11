export GOOGLE_APPLICATION_CREDENTIALS=../private-keys/bqbl-591f3-f7f1062e9016.json 
firebase functions:shell

In shell:
draftTeam({team:'den', league:'nbqbl', uidOverride:'4'})
createLeague({league: 'rbqbl'})
