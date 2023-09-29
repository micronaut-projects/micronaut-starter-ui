# Micronaut Launch UI

[![Build Status](https://github.com/micronaut-projects/micronaut-starter-ui/workflows/Publish/badge.svg)](https://github.com/micronaut-projects/micronaut-starter-ui/actions)

This project builds the [Micronaut Launch UI](https://launch.micronaut.io).

## To build the site for CI run:

```bash
./gradlew build
```

## Running locally

Tested on my machine with:

```bash
❯ npm --version
10.1.0
❯ node --version
v20.8.0
```

### Run micronaut-starter locally

```bash
CORS_ALLOWED_ORIGIN=http://localhost:3000 ./gradlew starter-web-netty:run
```

### Run the dev proxy server

```bash
cd dev-proxy-server
npm install
npm run start:starter
```

### Run the application locally

```bash
cd app/launch
npm run start:local
```

Your default browser should then navigate to http://localhost:3000/launch

## Updating The Version feed

You can find the version feed file at [./app/launch/public/mn-version-feed.json](./app/launch/public/mn-version-feed.json). It must be in valid JSON format, so beware of these gotyas!

#### Keys must be quoted

- GOOD

  ```
  {
      "key": "RELEASE",
      "baseUrl": "https://launch.micronaut.io",
      "order": 0
  }
  ```

- BAD

  ```
  {
      key: "RELEASE",
      baseUrl: "https://launch.micronaut.io",
      order: 0
  }
  ```

#### No trailing comma

- GOOD

  ```
  {
      "key": "RELEASE",
      ...
  },
  {
      "key": "NEXT",
      ...
  }
  ```

- BAD

  ```
  {
      "key": "RELEASE",
      ...
  },
  {
      "key": "NEXT",
      ...
  },
  ```

---
## Previous instructions...

These were here before I started working on this project. I'm leaving them here for now in case they are useful.

## For local development mimicing production launch site:

- To bypass CORS restrictions, Launch the Local Version / Proxy Server

```
cd ./dev-proxy-server
npm run start
```

- Start the dev build of the site

```
cd ./app/launch/
npm run start:local
```

## Running a Micronaut Starter API locally to dev against

If you want to run against a version of the starter api (Micronaut Starter Api)[https://github.com/micronaut-projects/micronaut-starter]

Outside of this project pull down that repo

```bash
git clone git@github.com:micronaut-projects/micronaut-starter.git
cd micronaut-starter
export CORS_ALLOWED_ORIGIN=http://localhost:3000
./gradlew starter-web-netty:run
```

Then start up a version server to provide that instance

```
cd ./dev-proxy-server
npm run start:starter
```

