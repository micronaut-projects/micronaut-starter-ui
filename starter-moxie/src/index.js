const express = require("express");
const cors = require("cors");

const launchUrl = "https://launch.micronaut.io";
const snapShotUrl = "https://snapshot.micronaut.io";

function setup(url, port) {
    const app = express();
    var proxy = require("express-http-proxy");
    app.use(cors());
        
    app.use('/', proxy(url));
    app.listen(port, () =>
        console.log(`Proxymation listening ${url} at http://localhost:${port}`)
    );
}

setup(launchUrl, 8080)
setup(snapShotUrl, 8081)


