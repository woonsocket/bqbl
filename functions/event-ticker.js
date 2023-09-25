const admin = require('firebase-admin');
const functions = require('firebase-functions');

const request = require('request-promise-native');

// These string values are referenced by clients of the event ticker.
class EventType {
  static get INT() { return 'INT'; }
  static get INT_TD() { return 'INT_TD'; }
  static get FUMBLE_LOST() { return 'FUML'; }
  static get FUMBLE_TD() { return 'FUM_TD'; }
  static get SAFETY() { return 'SAF'; }
}

/**
 * Every time a new event is created by the scraper, send notifications. Adds
 * the event to the database so that web clients can subscribe to the
 * /eventticker location for updates.
 */
exports.onNewEvent =
  functions.database.ref('/events/{year}/{week}/{type}/{eventId}')
    .onCreate((snap, context) => {
      const {year, week, type} = context.params;
      return processEvent(snap.val(), type, year, week);
    });

function processEvent(event, rawType, year, week) {
  const ticker = admin.database().ref(`/eventticker/${year}/${week}`);
  let type;
  if (rawType == 'interceptions') {
    type = event.td ? EventType.INT_TD : EventType.INT;
  } else if (rawType == 'fumbles') {
    type = event.td ? EventType.FUMBLE_TD : EventType.FUMBLE_LOST;
  } else if (rawType == 'safeties') {
    if (!event.qbFault) {
      return Promise.resolve();
    }
    type = EventType.SAFETY;
  } else if (rawType == 'passers' || rawType == 'overrides') {
    // Ignore for now.
    return Promise.resolve();
  } else {
    return Promise.reject(`unknown event type "${rawType}"`);
  }
  const tickerEntry = {
    'date': Date.now(),
    'team': event.team,
    'name': event.name,
    'desc': event.desc,
    'quarter': event.quarter,
    'time': event.time,
    'type': type,
  };

  return Promise.all([
    ticker.push(tickerEntry),
    sendToSlack(type, event.name, event.team, event.desc),
  ]);
}

function sendToSlack(eventType, playerName, team, desc) {
  const slackUrl = functions.config().slack.webhook_url;
  const channel = functions.config().slack.channel;
  if (!slackUrl || !channel) {
    console.log('skipping Slack send because Slack is not configured');
    return Promise.resolve();
  }

  let what = '';
  if (eventType == EventType.INT) {
    what = 'threw an interception';
  } else if (eventType == EventType.INT_TD) {
    what = 'threw a pick-6';
  } else if (eventType == EventType.FUMBLE_LOST) {
    what = 'lost a fumble';
  } else if (eventType == EventType.FUMBLE_TD) {
    what = 'lost a fumble for a TD';
  } else if (eventType == EventType.SAFETY) {
    what = 'gave up a safety';
  }

  const iconUrl = `https://static.www.nfl.com/f_png,q_85/league/api/clubs/logos/${team}`

  const payload = {
    'text': (`*${playerName} (${team})* ${what}\n` +
             `>${desc}`),
    'username': `BQBL Red Zone Channel (${team})`,
    'channel': channel,
    'icon_url': iconUrl,
  };
  return request.post({
    url: slackUrl,
    json: true,
    body: payload,
  }).catch(error => {
    if (error) {
      console.error(`Error sending to Slack: ${error}`);
    }
  });
}
