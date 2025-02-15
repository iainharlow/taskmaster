const functions = require("firebase-functions");
const admin = require("firebase-admin");
const cors = require("cors")({ origin: true });
const axios = require("axios");

if (!admin.apps.length) {
  admin.initializeApp();
}

exports.parseTasks = functions.https.onRequest((req, res) => {
  cors(req, res, async () => {
    if (req.method !== "POST") {
      return res.status(400).send("Please send a POST request");
    }

    // Verify App Check token from the client
    const appCheckToken = req.header("X-Firebase-AppCheck");
    if (!appCheckToken) {
      return res.status(401).send("Missing App Check token.");
    }
    try {
      await admin.appCheck().verifyToken(appCheckToken);
    } catch (error) {
      console.error("App Check token verification failed:", error);
      return res.status(401).send("Unauthorized: Invalid App Check token.");
    }

    const { inputText } = req.body;
    if (!inputText) {
      return res.status(400).send("Missing inputText in the request body");
    }

    // Build a prompt to instruct the LLM to extract tasks in a structured JSON format.
    const prompt = `Extract tasks from the following text. Output a JSON object with a key "tasks" that is an array of task objects.
Each task object should have the following properties:
- "title": string,
- "type": "personal",
- "completed": false.
Only output the JSON.

Input: "${inputText}"`;

    try {
      // Replace the URL below with your actual Vertex AI endpoint.
      const vertexEndpoint = "https://vertexai.googleapis.com/v1/projects/YOUR_PROJECT/locations/YOUR_LOCATION/endpoints/YOUR_ENDPOINT:predict";
      const response = await axios.post(
        vertexEndpoint,
        {
          instances: [{ prompt }],
          parameters: {} // Add model-specific parameters if needed.
        },
        {
          headers: {
            "Content-Type": "application/json",
            // Uncomment and set your authorization if required:
            // "Authorization": "Bearer YOUR_ACCESS_TOKEN",
          }
        }
      );

      // Assuming the LLM returns a JSON string in predictions[0].output.
      const prediction =
        response.data.predictions &&
        response.data.predictions[0] &&
        response.data.predictions[0].output;
      if (!prediction) {
        throw new Error("No prediction returned from the LLM");
      }

      let parsed;
      try {
        parsed = JSON.parse(prediction);
      } catch (parseError) {
        throw new Error("Failed to parse JSON from LLM response: " + parseError.message);
      }

      const tasks = parsed.tasks || [];
      return res.status(200).json({ tasks });
    } catch (error) {
      console.error("Error calling LLM:", error);
      return res.status(500).json({ error: error.message });
    }
  });
});