import express from 'express';
import bodyParser from 'body-parser';
import { setupApis } from './api';
import { lifecycle } from './lifecycle-manager';
import { initAmqp } from './services/amqp';

const app = express();

app.set('port', process.env.PORT || 8080);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

setupApis(app);
const { publish } = initAmqp();

let messageId = 0;

const server = app.listen(app.get('port'), () => {
  console.log(
    'App is running at http://localhost:%d in %s mode',
    app.get('port'),
    app.get('env')
  );

  setInterval(async () => {
    await publish(`Hello Pineapple ${messageId}`);
    messageId++;
  }, 1000);

  console.log('Press CTRL-C to stop\n');
});

const closeServer = async (): Promise<void> => {
  await server.close();
};

lifecycle.on('close', closeServer);

process
  .on('SIGTERM', async () => {
    process.exitCode = 1;
    await lifecycle.close();
  })
  .on('SIGINT', async () => {
    process.exitCode = 1;
    await lifecycle.close();
  })
  .on('uncaughtException', async (err) => {
    console.log('Uncaught exception', err);
    process.exitCode = 1;
    await lifecycle.close();
  })
  .on('unhandledRejection', async () => {
    process.exitCode = 1;
    await lifecycle.close();
  });
