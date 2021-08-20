const axios = require("axios");

const VERSION_FEED_URL = "https://micronaut.io/launch/mn-version-feed.json";
const { startVersionServer, toLocalUrl } = require("./commands");

/**
 * Start a version server server that serves up
 * Micronaut Starter API (https://github.com/micronaut-projects/micronaut-starter)
 * you are running locally, which by default runs on port 8080
 * when started via `./gradlew :starter-web-netty:run`
 */
async function serve() {
  const { data } = await axios.get(VERSION_FEED_URL);
  const versions = [{ key: "LOCAL_DEV", baseUrl: toLocalUrl(8080), order: 0 }];
  startVersionServer({
    ...data,
    versions,
  });
}

serve();
