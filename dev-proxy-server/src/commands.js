const express = require("express");
const cors = require("cors");
const proxy = require("express-http-proxy");

function toLocalUrl(port) {
  return `http://localhost:${port}`;
}

function startVersionServer(feed, port = 8088) {
  const localhost = toLocalUrl(port);
  const app = express();
  app.use(cors());
  app.get("*", (req, res) => res.json(feed));
  app.listen(port, () => {
    console.log(`Started version server on: ${localhost}`);
    console.table(feed.versions);
  });
  return localhost;
}

function startProxy(url, port) {
  const localhost = toLocalUrl(port);
  const app = express();
  app.use(cors());
  app.use("/", proxy(url));
  app.listen(port);
  return localhost;
}

module.exports = {
  toLocalUrl,
  startProxy,
  startVersionServer,
};
