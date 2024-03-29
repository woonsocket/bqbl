# Changelog

This changelog lists notable changes, except those that were nullified by a
holding penalty, or that we forgot.

We don't follow SemVer principles correctly, but we made up for it by naming
releases alliteratively.

## [Unreleased]

### Added
- Pro Bowl mode!
- Port from CRA to Vite

### Fixed
- Don't crash the scraper when parsing a safety that no QB took part in (e.g., a
  safety on a punt)

## [0.4.0] - "Pitiful Pederson" - 2017-10-08

### Added
- Show road teams on the lineup setter.
- Sort BQBL Standings page by score. (This was more work than you would hope.)
- Sort NFL Standings page by score. (This wasn't.)
- Show an animation if a lineup change hasn't yet been saved to the database.
- Automatically lock each week at 1:05 PM Eastern on Sunday.
- Show placeholder text on empty pages so they don't feel broken.

### Fixed
- BQBL Scores/Standings pages no longer create duplicate copies of every team
  every time somebody edits a lineup.
- Count 24/7 points in the BQBL Standings.
- NFL standings page should no longer fail to load, hopefully.

## [0.3.1] - 2017-09-28

### Added
- (aerion) Sum the two teams' scores on the scoreboard.

### Fixed
- (aerion) Fix 24/7 points console.

## [0.3.0] - "Woeful Wynn" - 2017-09-28

### Added
- (aerion) More detailed standings page, including each player's scores for each
  week. Still needs more UI work.
- (aerion) More compact scores page, using the same needs-work UI elements as
  above.
- (aerion) Show game score on the scoreboard.

### Fixed
- (harveyj) Fix the BQBL scoreboard page database path
- (aerion) Fix week selector defaults on a few pages
- (aerion) Fix locking of picks for past weeks
- (harveyj) Turn on reactive design for side menu

## [0.2.0] - "Desperate Detmer" - 2017-09-16

### Added
- (aerion) Red Zone (tm) ticker - see what interesting events are happening in
  real time
- (aerion) Show how many times you've used each team on the lineup page
- (harveyj) An "anti-scoreboard" where you can see how poorly the teams on your
  bench did, and by proxy, how bad you are at BQBL

## [0.1.0] - "Cowardly Couch" - 2017-09-06

FOOTBALL
