// To do/fix

import productRoutes from './posts.js';
import path from 'path';

import {static as staticDir} from 'express';

const constructorMethod = (app) => {
  app.use('/products', productRoutes);
  app.get('/products', (req, res) => {
    res.sendFile(path.resolve('static/productPage.html'));
  });
  app.use('/public', staticDir('public'));
  app.use('*', (req, res) => {
    res.redirect('/products');
  });
};

export default constructorMethod;