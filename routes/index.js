import userRoutes from './users.js';
import orderRoutes from './orders.js';
import productRoutes from './products.js';
import authRoutes from './auth.js';
import categoriesRoutes from './categories.js';
import reviewRoutes from './reviews.js';
import salesRoutes from './sales.js';
<<<<<<< Updated upstream
import shoppingCartRoutes from './shoppingCart.js';
=======
import dashboardRoutes from './dashboard.js'
// import shoppingCartRoutes from './shoppingCart.js';
>>>>>>> Stashed changes
// import checkoutRoutes from './checkout.js';
import path from 'path';

const constructorMethod = (app) => {
<<<<<<< Updated upstream

    // This will ensure that the login state when logged in passes through every page
    app.use(async (req, res, next) => {
        req.isAuthenticated = Boolean(req.session.userId);
        res.locals.isAuthenticated = req.isAuthenticated;
        res.locals.userId = req.session.userId;

        // For debugging purposes
        console.log({
            sessionUserId: req.session.userId,
            localsIsAuth: res.locals.isAuthenticated
        });
        next();
    });

=======
>>>>>>> Stashed changes
    app.use('/users', userRoutes);
    app.use('/orders', orderRoutes);
    app.use('/products', productRoutes);
    app.use('/categories', categoriesRoutes);
    app.use('/reviews', reviewRoutes);
    app.use('/cart', shoppingCartRoutes);
    // app.use('/checkout', checkoutRoutes);
    app.use('/auth', authRoutes);
<<<<<<< Updated upstream
    app.use('/sales', salesRoutes);
    app.get('/payment_index', (req, res) => {
        res.sendFile(path.resolve('static/payment_index.html'));
    });
=======
    app.use('/sales', salesRoutes)
    app.use('/dashboard', dashboardRoutes);
>>>>>>> Stashed changes
    app.use(/(.*)/, (req, res) => {
        return res.status(404).json({ error: 'Not found'});
    });
}

export default constructorMethod;