import express from 'express';
import middleWareFunctions from './tasks/middleware.js';
 
import { dbConnection, closeConnection } from './config/mongoConnection.js';
import configRoutes from './routes/index.js';


import * as productSeed from './tasks/seedProductsReviews.js';
 import * as categorySeed from './tasks/RDCatseed.js';
import * as userSeed from './tasks/RDUsersseed.js';
import * as orderSeed from './tasks/seedOrders.js';
import * as saleSeed from './tasks/seedSales.js';

// Initialize app with express
const app = express();
const PORT = process.env.PORT || 5000;



// DB connection


(async () => {

  const db = await dbConnection();
  console.log('Connected to MongoDB!');

  try {

    await userSeed.seedDB();
    //await categorySeed.seedDB();
    //await productSeed.productReviewSeed();
    //await orderSeed.seedOrders();
   // await saleSeed.seedSales();
    // productSeed.productReviewSeed();
    //await ; use this for seed files
    
  } catch (e) {
    console.error('Errors seeding or server setup:', e);
} 
try {
  await categorySeed.seedDB();
} catch (error) {
  console.error('Errors seeding or server setup:', e);
}
try {
  await productSeed.productReviewSeed();
} catch (error) {
  console.error('Errors seeding or server setup:', e);
}
try {
  await orderSeed.seedOrders();
} catch (error) {
  console.error('Errors seeding or server setup:', e);
}
try {
  await saleSeed.seedSales();
} catch (error) {
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




