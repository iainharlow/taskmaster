// functions/index.js

const functions = require("firebase-functions");

// A simple HTTPS function to test backend functionality
exports.helloTaskmaster = functions.https.onRequest((req, res) => {
  res.send("Hello from Taskmaster Cloud Functions!");
});
