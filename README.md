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

Ensure you have micronaut-starter checked out somewhere:

```bash
git clone git@github.com:micronaut-projects/micronaut-starter.git
cd micronaut-starter
```

And then run the starter-web-netty app (with the CORS filter configured):

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
npm install
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
