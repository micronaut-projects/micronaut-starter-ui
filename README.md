# Micronaut Launch UI

[![Build Status](https://github.com/micronaut-projects/micronaut-starter-ui/workflows/Publish/badge.svg)](https://github.com/micronaut-projects/micronaut-starter-ui/actions)

This project builds the [Micronaut Launch UI](https://launch.micronaut.io).

## To build the site for CI run:

```bash
./gradlew build --console=plain
```

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
$ git clone git@github.com:micronaut-projects/micronaut-starter.git
$ cd micronaut-starter
$ ./gradlew starter-web-netty:run
```

Then start up a version server to provide that instance

```
cd ./dev-proxy-server
npm run start:starter
```

## Updating The Version feed

You can find the version feed file at [./app/launch/public/mn-version-feed.json](./app/launch/public/mn-version-feed.json). It must be in valid JSON format, so beware of these gotyas!

**Keys must be quoted**

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

**No trailing comma**

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
