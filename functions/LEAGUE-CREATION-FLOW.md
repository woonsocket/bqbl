League creation flow:
Admin: call createLeague({league: $LEAGUE_ID})
Users: go to bqbl.futbol/draft/$LEAGUE_ID, join league
Admin: call setDraftOrder({league: $LEAGUE_ID})
Users: draft at bqbl.futbol/draft/$LEAGUE_ID
Admin: call finalizeDraft
Admin: call createNewYear to finalize league, create the starts table.