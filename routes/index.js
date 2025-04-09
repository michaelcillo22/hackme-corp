import userRoutes from './users.js';
import orderRoutes from './orders.js';
import productRoutes from './products.js';
// import shoppingCartRoutes from '../data/shoppingCart.js';
// import checkoutRoutes from '../data/checkout.js';
import {static as staticDir} from 'express';

const constructorMethod = (app) => {

    app.use('/users', userRoutes);
    app.use('/orders', orderRoutes);
    app.use('/products', productRoutes);
    // app.use('/shoppingCarts', shoppingCartRoutes);
    // app.use('/checkout', checkoutRoutes);

    // For the css
    app.use('/public', staticDir('public'));

    app.use(/(.*)/, (req, res) => {
        return res.status(404).json({ error: 'Not found'});
        // res.status(404).render("productError", { errorMsg: "Page not found" });
    });
}

export default constructorMethod;