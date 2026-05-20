import express, { Application } from 'express';
import { configureApp } from './app/app';
import { AppDataSource } from './config/data-source';
import * as dotenv from 'dotenv';
import path from 'path';

const envPath = path.join(__dirname, '..', 'auth.env');
dotenv.config({ path: envPath });

const app: Application = express();

async function initializeApp() {
  try {
    await AppDataSource.initialize();
    if (AppDataSource.isInitialized)
      console.log('Database connected successfully');

    configureApp(app, AppDataSource);

    const PORT = process.env.PORT;
    console.log(PORT);

    app.listen(PORT, () => {
      console.log('Server started successfully on ' + PORT);
    });
  } catch (error) {
    console.error('Error during initialization:', error);
    process.exit(1);
  }
}

initializeApp();
