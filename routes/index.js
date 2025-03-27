import { Router } from 'express';
const router = Router();

import { find } from '../models/product';

// GET the Hackmazon Landing Page
router.get('/', async function getMainPage(req, res, next) {
  const successMgs = req.flash('success')[0];

  const products = await find().lean();

  res.render('shop/index', {
    title: 'Shopping cart',
    products,
    successMgs: successMgs,
    noMessage: !successMgs,
  });
});

export default router;