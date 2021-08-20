# Micronaut Launch APP

Frontend module of Micronaut Launch. Developed with React.js .

## Updating The Version feed

You can find the version feed file at

## Setup

Add the following environment variables:

```bash
export REACT_APP_VERSION_FEED=http://localhost:8088/mn-versions.json
```

## Running the API

Run the Micronaut Backend API locally:

```bash
$ git clone git@github.com:micronaut-projects/micronaut-starter.git
$ cd micronaut-starter
$ ./gradlew starter-web-netty:run
```

To run using a local proxy server, you can

```
cd ./local-dev-proxy
npm run start
```

- Start the dev build of the site

```
cd ./main/src/main/js/launch/
npm run start:local
```

## Running the Frontend

```bash
$ npm install
$ npm start
```
