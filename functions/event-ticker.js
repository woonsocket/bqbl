const admin = require('firebase-admin');
const functions = require('firebase-functions');

// These string values are referenced by clients of the event ticker.
class EventType {
  static get INT() { return 'INT'; }
  static get INT_TD() { return 'INT_TD'; }
  static get FUMBLE_LOST() { return 'FUML'; }
  static get FUMBLE_TD() { return 'FUM_TD'; }
  static get SAFETY() { return 'SAF'; }
}

/**
 * Every time a new event is created, send notifications. Adds the event to the
 * database so that web clients can subscribe to the /eventticker location for
 * updates.
 */
exports.onNewEvent = functions.database.ref('/events/{year}/{week}/{type}/{eventId}')
  .onCreate(event => {
    const {year, week, type} = event.params;
    processEvent(event.data.val(), type, year, week);
  });

function processEvent(event, eventType, year, week) {
  const ticker = admin.database().ref(`/eventticker/${year}/${week}`);
  let type;
  if (eventType == 'interceptions') {
    type = event.td ? EventType.INT_TD : EventType.INT;
  } else if (eventType == 'fumbles') {
    type = event.td ? EventType.FUMBLE_TD : EventType.FUMBLE_LOST;
  } else if (eventType == 'safeties') {
    if (!event.qbFault) {
      return;
    }
    type = EventType.SAFETY;
  } else if (eventType == 'passers' || eventType == 'overrides') {
    // Ignore for now.
    return;
  } else {
    console.error(`unknown event type "${eventType}"`);
    return;
  }
  ticker.push({
    'date': Date.now(),
    'desc': event.desc,
    'quarter': event.quarter,
    'time': event.time,
    'type': type,
  });
}
