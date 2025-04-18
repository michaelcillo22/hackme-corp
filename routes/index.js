import userRoutes from './users.js';
import orderRoutes from './orders.js';
import productRoutes from './index.js';
import authRoutes from './auth.js'
// import shoppingCartRoutes from './shoppingCart.js';
// import checkoutRoutes from './checkout.js';






const constructorMethod = (app) => {

    app.use('/users', userRoutes);
    app.use('/orders', orderRoutes);
    app.use('/products', productRoutes);
    // app.use('/shoppingCarts', shoppingCartRoutes);
    // app.use('/checkout', checkoutRoutes);
    app.use('/auth', authRoutes);

    app.use(/(.*)/, (req, res) => {
        return res.status(404).json({ error: 'Not found'});
    });
}

export default constructorMethod;