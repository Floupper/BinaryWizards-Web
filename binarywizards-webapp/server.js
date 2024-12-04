const https = require("https");
const fs = require("fs");
const path = require("path");
const express = require("express");
require("dotenv").config();

const app = express();

// Serve static files from the React app
app.use(express.static(path.join(__dirname, "build")));

// Redirect all other routes to index.html (for React Router)
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

const httpsPort = process.env.REACT_APP_PORT;

let sslOptions = {};
if (process.env.APP_ENV === "server") {
  try {
    sslOptions = {
      key: fs.readFileSync(process.env.key),
      cert: fs.readFileSync(process.env.cert),
    };
    console.log("SSL Certificates loads with succs.");
  } catch (err) {
    console.error("Error loading SSL certificates :", err);
  }
}

if (process.env.APP_ENV === "server") {
  https.createServer(sslOptions, app).listen(httpsPort, () => {
    console.log(`🚀 Server running on https://0.0.0.0:${httpsPort}`);
  });
} else {
  app.listen(httpsPort, "0.0.0.0", () => {
    console.log(`Server is running on http://0.0.0.0:${httpsPort}`);
  });
}
