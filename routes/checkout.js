import { Router } from 'express';
import Stripe from 'stripe';    // stripe payment processing platform

const router = Router();
const stripe = new Stripe(stripeSecretKey);

router.get('/checkout', isLoggedIn, (req, res) => {
  if (!req.session.cart) {
    return res.redirect('/shopping-cart');
  }
  const cart = new Cart(req.session.cart);
  const errMsg = req.flash('error')[0];

  return res.render('shop/checkout', {
    total: cart.totalPrice,
    errMsg,
    noError: !errMsg,
  });
});

router.post('/checkout', isLoggedIn, async (req, res) => {
  if (!req.session.cart) {
    return res.redirect('/shopping-cart');
  }
  const cart = new Cart(req.session.cart);

  try {
    const charge = await stripe.charges.create({
      amount: cart.totalPrice * 100,
      currency: 'usd',
      source: req.body.stripeToken, // obtained from Stripe.js
      description: 'Test Charge',
    });

    const order = new Order({
      user: req.user,
      cart,
      address: req.body.address,
      name: req.body.name,
      paymentId: charge.id,
    });

    await order.save();
    req.flash('success', 'Successfully bought product!');
    req.session.cart = null;
    res.redirect('/');
  } catch (err) {
    req.flash('error', err.message);
    res.redirect('/checkout');
  }
});

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  req.session.oldUrl = req.url;
  res.redirect('/user/signin');
}

export default router;
