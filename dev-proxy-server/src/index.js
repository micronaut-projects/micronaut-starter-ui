const express = require("express");
const cors = require("cors");
const axios = require("axios");
const proxy = require("express-http-proxy");

const VERSION_FEED_URL = "https://micronaut.io/launch/mn-version-feed.json";

function toLocalUrl(port) {
  return `http://localhost:${port}`;
}

function startProxy(url, port) {
  const localhost = toLocalUrl(port);
  const app = express();
  app.use(cors());
  app.use("/", proxy(url));
  app.listen(port, () =>
    console.log(`Creating a Proxy for ${url} at ${localhost}`)
  );
  return localhost;
}

function startVersionServer(feed, port = 8088) {
  const localhost = toLocalUrl(port);
  const app = express();
  app.use(cors());
  app.get("*", (req, res) => res.json(feed));
  app.listen(port, () => {
    console.log(`Starting version server on ${localhost}`);
  });
  return localhost;
}

async function serve() {
  let port = 8080;
  const { data } = await axios.get(VERSION_FEED_URL);
  const versions = [];
  data.versions.forEach((version) => {
    const localhost = startProxy(version.baseUrl, port++);
    versions.push({
      ...version,
      baseUrl: localhost,
    });
  });

  startVersionServer({
    ...data,
    versions,
  });
}

serve();
