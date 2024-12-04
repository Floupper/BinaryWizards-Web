const https = require("https");
const fs = require("fs");
const path = require("path");
const express = require("express");
require("dotenv").config();

const app = express();

// Servir les fichiers statiques de l'application React buildée
app.use(express.static(path.join(__dirname, "build")));

// Toute autre route redirige vers index.html (pour React Router)
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
    console.log("Certificats SSL chargés avec succès.");
  } catch (err) {
    console.error("Erreur lors du chargement des certificats SSL :", err);
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
