import { Server } from 'http';
import app from './app';
import config from './config';
import { prisma } from './lib/prisma';

async function main() {
  await prisma.$connect();
  console.log('Database connected!');
  const server: Server = app.listen(config.port, () => {
    console.log(`Sever is up on port ${config.port}`);
  });

  const exitHandler = async () => {
    if (server) {
      await prisma.$disconnect();
      server.close(() => {
        console.info('Server closed!');
      });
    }
    process.exit(1);
  };
  process.on('uncaughtException', error => {
    console.log(error);
    exitHandler();
  });

  process.on('unhandledRejection', error => {
    console.log(error);
    exitHandler();
  });
}

main();
