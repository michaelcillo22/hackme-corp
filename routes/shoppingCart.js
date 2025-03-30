import { Router } from 'express';
import Cart from '../data/shoppingCart';
import Product from '../data/products';

const router = Router();

router.get('/cart/add-to-cart/:id', async (req, res) => {
  const productId = req.params.id;
  const cart = new Cart(req.session.cart ? req.session.cart : {});

  try {
    const product = await Product.findById(productId);
    if (!product) {
      return res.redirect('/');
    }
    cart.add(product, product.id);
    req.session.cart = cart;
    console.log(req.session.cart);
    res.redirect('/');
  } catch (err) {
    console.error(err);
    res.redirect('/');
  }
});

router.get('/cart/reduce/:id', (req, res) => {
  const productId = req.params.id;
  const cart = new Cart(req.session.cart ? req.session.cart : {});
  cart.reduceByOne(productId);
  req.session.cart = cart;
  res.redirect('/cart');
});

router.get('/cart/remove/:id', (req, res) => {
  const productId = req.params.id;
  const cart = new Cart(req.session.cart ? req.session.cart : {});
  cart.removeItem(productId);
  req.session.cart = cart;
  res.redirect('/cart');
});

router.get('/cart', (req, res) => {
  if (!req.session.cart) {
    return res.render('shop/cart', { products: null });
  }

  const cart = new Cart(req.session.cart);
  res.render('shop/cart', {
    products: cart.generateArray(),
    totalPrice: cart.totalPrice,
  });
});

export default router;
