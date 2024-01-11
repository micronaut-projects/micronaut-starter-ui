const axios = require("axios");
const VERSION_FEED_URL = "https://micronaut.io/launch/mn-version-feed.json";
const { startProxy, startVersionServer } = require("./commands");

/**
 * Start a version server and proxy server for the current
 * Micronaut Starter versions mirroring production launch site
 * This will fetch the production feed, and create proxies for
 * each of the remote sites at incrementing ports starting at 8080
 */
async function serve() {
  let port = 8080;
  const { data } = await axios.get(VERSION_FEED_URL);
  const versions = [];
  data.versions.forEach((version) => {
    const localhost = startProxy(version.baseUrl, port++);
    versions.push({
      ...version,
      baseUrl: localhost,
      __original: version.baseUrl,
    });
  });

  startVersionServer({
    ...data,
    versions,
  });
}

serve();
