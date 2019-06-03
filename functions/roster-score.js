const admin = require('firebase-admin');
const entries = require('object.entries');
const functions = require('firebase-functions');

const scoring = require('./scoring.js');

admin.initializeApp();

