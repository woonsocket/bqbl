NOTE Do this from the shell:

League creation flow from spreadsheet:
use spreadsheet to generate draft json
upload it to leaguespec/$LEAGUE/draft/$YEAR
export GOOGLE_APPLICATION_CREDENTIALS=../private-keys/blah 
firebase functions:shell
>> finalizeDraft({league:'nbqbl', year:"2029"})
>> createNewYear({league:'nbqbl', year:"2029"})

League creation flow with draft:
Admin: call `createLeague({data: {league: $LEAGUE_ID}})`
Users: go to bqbl.futbol/draft/$LEAGUE_ID, join league
Admin: call `setDraftOrder({data: {league: $LEAGUE_ID}})`
Users: draft at bqbl.futbol/draft/$LEAGUE_ID
Admin: call `finalizeDraft`
Admin: call `createNewYear` to finalize league, create the starts table.
