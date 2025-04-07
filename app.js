import { dbConnection, closeConnection } from './config/mongoConnection.js';

import express from 'express';
import { seedDB } from './seed.js';
const app = express();
// import configRoutes from './routes/index.js';



(async () => {
    const db = await dbConnection();
    console.log('Database connected');

    try {
        await seedDB();

    } catch (e) {
        console.error('Errors seeding or server setup:', e);
    } finally {
        await closeConnection();
    }

app.use(express.json());

// configRoutes(app);

app.listen(3000, () => {
    console.log('Ive now got a server!');
    console.log('My routes will be running on http://localhost:3000');
});
})();