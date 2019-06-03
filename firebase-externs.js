// Closure compiler externs for Firebase 4.1.3 API. Not comprehensive -- just
// add stuff here as we use it.


/** @const */
var firebase = {};


/** @param {!Object} config */
firebase.initializeApp = function(config) {};


/** @return {!firebase.database.Database} */
firebase.database = function() {};


/** @interface */
firebase.database.Database;


/**
 * @param {string=} path
 * @return {!firebase.database.Reference}
 */
firebase.database.Database.prototype.ref = function(path) {};


/** @interface */
firebase.database.Reference;


/**
 * @param {string} eventType
 * @param {function(firebase.database.DataSnapshot)} callback
 * @param {function(Error)=} cancelCallbackOrContext
 * @param {!Object=} context
 * @return {function()}
 */
firebase.database.Reference.prototype.on =
    function(eventType, callback, cancelCallbackOrContext, context) {};


/**
 * @param {string=} eventType
 * @param {function(firebase.database.DataSnapshot)=} callback
 * @param {!Object=} context
 */
firebase.database.Reference.prototype.off =
    function(eventType, callback, context) {};


/** @interface */
firebase.database.DataSnapshot;


/** @return {*} */
firebase.database.DataSnapshot.prototype.val = function() {};
