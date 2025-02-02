const functions = require("firebase-functions");
const admin = require("firebase-admin");
const cors = require("cors")({origin: true});

if (!admin.apps.length) {
  admin.initializeApp();
}

exports.parseTasks = functions.https.onRequest((req, res) => {
  cors(req, res, async () => {
    if (req.method !== "POST") {
      return res.status(400).send("Please send a POST request");
    }

    const {inputText} = req.body;
    if (!inputText) {
      return res.status(400)
        .send("Missing inputText in the request body");
    }

    const lines = inputText.split("\n").filter(
      (line) => line.trim().length > 0
    );

    const tasks = lines.map((line) => {
      return {
        title: line.trim(),
        type: "personal",
        completed: false,
        createdAt: admin.firestore.FieldValue.serverTimestamp()
      };
    });

    return res.status(200).json({tasks: tasks});
  });
});