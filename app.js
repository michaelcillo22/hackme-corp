import express from 'express';
import middleWareFunctions from './tasks/middleware.js';
import router from './routes/index.js';  
import { dbConnection, closeConnection } from './config/mongoConnection.js';
import configRoutes from './routes/index.js';

// Initialize app with express
const app = express();
const PORT = process.env.PORT || 5000;



// DB connection


(async () => {

  const db = await dbConnection();
  console.log('Connected to MongoDB!');

  try {
    //await ; use this for seed files
    
  } catch (e) {
    console.error('Errors seeding or server setup:', e);
} finally {
    await closeConnection();
}
})();

// Middleware Configuration
middleWareFunctions(app);

configRoutes(app);

// Use Routes


app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:5000`);
});
