import {Router} from 'express';
const router = Router();
// import product data 
// import * helpers from '../helpers.js';

const Cart = require('../data/shoppingCart').default;
const Product = require('../data/products');

router.get('/cart/add-to-cart/:id', function (req, res) {
    const productId = req.params.id;
    const cart = new Cart(req.session.cart ? req.session.cart : {});
  
    Product.findById(productId, function (err, product) {
      if (err) {
        return res.redirect('/');
      }
      cart.add(product, product.id);
      req.session.cart = cart;
      console.log(req.session.cart);
      res.redirect('/');
    });
  });
  
  router.get('/cart/reduce/:id', function (req, res) {
    const productId = req.params.id;
    const cart = new Cart(req.session.cart ? req.session.cart : {});
    cart.reduceByOne(productId);
    req.session.cart = cart;
    res.redirect('/cart');
  });
  
  router.get('/cart/remove/:id', function (req, res) {
    const productId = req.params.id;
    const cart = new Cart(req.session.cart ? req.session.cart : {});
    cart.removeItem(productId);
    req.session.cart = cart;
    res.redirect('/cart');
  });
  
  router.get('/cart', function (req, res) {
    if (!req.session.cart) {
      return res.render('shop/cart', { products: null });
    }
  
    const cart = new Cart(req.session.cart);
    return res.render('shop/cart', {
      products: cart.generateArray(),
      totalPrice: cart.totalPrice,
    });
  });
  
  module.exports = router;