import express from 'express';
import middleWareFunctions from './tasks/middleware.js';
import router from './routes/index.js';  
import { dbConnection, closeConnection } from './config/mongoConnection.js';
import path from 'path';
import { fileURLToPath } from 'url';

// Import seed files
import * as productReviewSeed from './tasks/seedProductsReviews.js';
import * as categorySeed from './tasks/RDCatseed.js';
import * as userSeed from './tasks/RDUsersseed.js';
import * as orderSeed from './tasks/seedOrders.js'

// Initialize app with express
const app = express();
const PORT = process.env.PORT || 5000;

// Ensure correct directory path
const fileName = fileURLToPath(import.meta.url);
const directoryName = path.dirname(fileName);

// For loading CSS and client JS
app.use('/public', express.static(path.join(directoryName, 'public')));


// DB connection


(async () => {

  const db = await dbConnection();
  console.log('Connected to MongoDB!');

  try {
    //await ; use this for seed files
    await userSeed.seedDB();
    await categorySeed.seedDB();
    // await orderSeed.seedDB();
    await productReviewSeed.productReviewSeed();

  } catch (e) {
    console.error('Errors seeding or server setup:', e);
  }
  // finally {
  //   await closeConnection();
  // }
})();

// Middleware Configuration
middleWareFunctions(app);

// Use Routes
// app.use('/', router);
// Call routes with the app instance since it's already imported
router(app);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
