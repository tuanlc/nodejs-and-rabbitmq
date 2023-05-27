import * as amqplib from 'amqplib';
import amqpConnectionManager, {
  Channel,
  ChannelWrapper,
} from 'amqp-connection-manager';
import {
  RABBITMQ_HOST,
  RABBITMQ_PASS,
  RABBITMQ_PORT,
  RABBITMQ_USER,
} from '../config';
import { lifecycle } from '../lifecycle-manager';

const amqpURL = `amqp://${RABBITMQ_USER}:${RABBITMQ_PASS}@${RABBITMQ_HOST}:${RABBITMQ_PORT}`;
const exchangeType = 'topic';
const topic = 'node-and-amqp';
const queue = 'node-and-amqp';
const deadLetterExchange = 'node-and-amqp:dead-letter-exchange';
const durableExchangeConfig = {
  durable: true,
  autoDelete: false,
};
const durableQueueConfig = {
  exclusive: false,
  durable: true,
  autoDelete: false,
  arguments: {
    deadLetterExchange,
  },
};

export const initAmqp = (): { publish: (message: string) => Promise<void> } => {
  const connectionManager = amqpConnectionManager.connect([amqpURL]);

  connectionManager.on('connect', () =>
    console.info(`AMQP: Connected to server!`)
  );
  connectionManager.on('disconnect', (err) =>
    console.info(`AMQP: Disconnected from server.`, err)
  );

  const channelWrapper = connectionManager.createChannel({
    json: true,
  });

  lifecycle.on('close', async () => {
    await channelWrapper.close();
    await connectionManager.close();
  });

  channelWrapper.addSetup(async (channel: Channel) => {
    try {
      await channel.assertExchange(topic, exchangeType, durableExchangeConfig);
      await channel.assertExchange(
        deadLetterExchange,
        exchangeType,
        durableExchangeConfig
      );
      await channel.assertQueue(queue, durableQueueConfig);
      await channel.bindQueue(queue, topic, '#');
      await channel.consume(
        topic,
        async (message: amqplib.ConsumeMessage | null) =>
          onMessage(message, channel)
      );

      console.info(`AMQP: Subscribed to the topic '${topic}'`);
    } catch (err) {
      console.error(`AMQP: Unable to subscribe to the topic '${topic}':`, err);
    }
  });

  return {
    publish: publish(channelWrapper),
  };
};

const onMessage = async (
  message: amqplib.ConsumeMessage | null,
  channel: amqplib.Channel
): Promise<void> => {
  console.info('Received message', {
    content: message?.content.toString() || null,
  });
  channel.ack(message as amqplib.Message);
};

export const publish =
  (channelWrapper: ChannelWrapper) =>
  async (message: string): Promise<void> => {
    console.info('AMQP: publishing message to:', topic);

    try {
      await channelWrapper.publish(topic, '#', message);

      console.info(
        `AMQP: Published a message with the topic '${topic}' and data:`,
        message
      );
    } catch (err) {
      console.error(
        `AMQP: Unable to publish a message  with the topic '${topic}':`,
        err
      );
    }
  };
