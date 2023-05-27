# Simple project Nodejs app connect to Rabbitmq

## Overview

- There are 2 folders:
  - /app: contains Nodejs application code and docker file
  - /deployment: contains docker-compose.yml file

## For the app

- **Note**: For the app codebase, I've used my [Typescript Express.js Template](https://github.com/tuanlc/typescript-expressjs-template)
- The Node application has a connection to Rabbitmq
  - A subscriber: print messages to console and ACK the messages
  - A publisher: an interval, it enqueues messages to the queue once per second

## To test project locally

```bash
$ git clone path-to-project
$ cd deployemt
$ docker compose up --build
```

## Sample result from console
```bash
deployment-app-1       | AMQP: Published a message with the topic 'node-and-amqp' and data: Hello Pineapple 6
deployment-app-1       | AMQP: publishing message to: node-and-amqp
deployment-app-1       | Received message { content: '"Hello Pineapple 7"' }
deployment-app-1       | AMQP: Published a message with the topic 'node-and-amqp' and data: Hello Pineapple 7
deployment-app-1       | AMQP: publishing message to: node-and-amqp
deployment-app-1       | Received message { content: '"Hello Pineapple 8"' }
deployment-app-1       | AMQP: Published a message with the topic 'node-and-amqp' and data: Hello Pineapple 8
deployment-app-1       | AMQP: publishing message to: node-and-amqp
deployment-app-1       | Received message { content: '"Hello Pineapple 9"' }
deployment-app-1       | AMQP: Published a message with the topic 'node-and-amqp' and data: Hello Pineapple 9
deployment-app-1       | AMQP: publishing message to: node-and-amqp
deployment-app-1       | Received message { content: '"Hello Pineapple 10"' }
deployment-app-1       | AMQP: Published a message with the topic 'node-and-amqp' and data: Hello Pineapple 10
deployment-app-1       | AMQP: publishing message to: node-and-amqp
deployment-app-1       | Received message { content: '"Hello Pineapple 11"' }
deployment-app-1       | AMQP: Published a message with the topic 'node-and-amqp' and data: Hello Pineapple 11
```
