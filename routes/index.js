import userRoutes from '../data/users.js';
import orderRoutes from '../data/orders.js';
import productRoutes from '../data/index.js';
// import shoppingCartRoutes from '../data/shoppingCart.js';
// import checkoutRoutes from '../data/checkout.js';






const constructorMethod = (app) => {

    app.use('/users', userRoutes);
    app.use('/orders', orderRoutes);
    app.use('/products', productRoutes);
    app.use('/shoppingCarts', shoppingCartRoutes);
    app.use('/checkout', checkoutRoutes);

    app.use(/(.*)/, (req, res) => {
        return res.status(404).json({ error: 'Not found'});
    });
}

export default constructorMethod;