import express from 'express';
import middleWareFunctions from './tasks/middleware.js';
 
import { dbConnection, closeConnection } from './config/mongoConnection.js';
import configRoutes from './routes/index.js';


import * as productSeed from './tasks/seedProductsReviews.js';
 import * as categorySeed from './tasks/RDCatseed.js';
import * as userSeed from './tasks/RDUsersseed.js';
import * as orderSeed from './tasks/seedOrders.js'

// Initialize app with express
const app = express();
const PORT = process.env.PORT || 5000;



// DB connection


(async () => {

  const db = await dbConnection();
  console.log('Connected to MongoDB!');

  try {

    userSeed.seedDB();
    categorySeed.seedDB();
    productSeed.productReviewSeed();
    orderSeed.seedOrders();
    // productSeed.productReviewSeed();
    //await ; use this for seed files
    
  } catch (e) {
    console.error('Errors seeding or server setup:', e);
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

process.on('SIGINT', async () => {
  console.log('Closing MongoDB connection...');
  await closeConnection();
  process.exit(0);
});
process.on('SIGTERM', async () => {
  console.log('Closing MongoDB connection...');
  await closeConnection();
  process.exit(0);
});




