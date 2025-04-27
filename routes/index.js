import userRoutes from './users.js';
import orderRoutes from './orders.js';
import productRoutes from './products.js';
import authRoutes from './auth.js';
import categoriesRoutes from './categories.js';
import reviewRoutes from './reviews.js';
import salesRoutes from './sales.js';
import shoppingCartRoutes from './shoppingCart.js';
import path from 'path';

const constructorMethod = (app) => {


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



    app.use('/users', userRoutes);
    app.use('/orders', orderRoutes);
    app.use('/products', productRoutes);
    app.use('/categories', categoriesRoutes);
    app.use('/reviews', reviewRoutes);
    app.use('/cart', shoppingCartRoutes);
    app.use('/auth', authRoutes);
    app.use('/sales', salesRoutes);
    
    app.use(/(.*)/, (req, res) => {
        return res.status(404).json({ error: 'Not found'});
    });
}

export default constructorMethod;