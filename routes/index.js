//Here you will import route files and export them as used in previous labs
import productRoutes from './products.js';
import {static as staticDir} from 'express';

const constructorMethod = (app) => {
  app.use('/products', productRoutes);

  // For the css
  app.use('/public', staticDir('public'));

  // For any other page not found
  app.use('*', (req, res) => {
    res.status(404).render("productError", { errorMsg: "Page not found" });
  });
};

export default constructorMethod;