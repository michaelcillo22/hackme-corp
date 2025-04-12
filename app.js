import { dbConnection, closeConnection } from './config/mongoConnection.js';
import express from 'express';
import { seedDB } from './seed.js';
// import configRoutes from './routes/index.js';

const app = express();

(async () => {
    const db = await dbConnection();
    console.log('Database connected');

    try {
        await seedDB();
    } catch (e) {
        console.error('Errors seeding or server setup:', e);
    }

    app.use(express.json());

    // Uncomment and configure routes if needed
    // configRoutes(app);

    app.listen(3000, () => {
        console.log('Ive now got a server!');
        console.log('My routes will be running on http://localhost:3000');
    });

    await closeConnection();
})();
