import helpers from "../helpers/helpers_CD.js";
import {products} from "../config/mongoCollections.js";
import {carts} from "../config/mongoCollections.js";
import { ObjectId } from "mongodb";
import {Router} from "express";
import {shoppingCart} from "../data/index.js";

const router = Router();

// add item to cart
router.post('/cart/add', async (req, res) => {
    try {
        const { userId, productId, quantity } = req.body;

        if (!userId || !productId || !quantity) {
            throw new Error("Missing required fields: userId, productId, quantity.");
        }

        const product = await products.getProductById(productId);
        if (!product) {
            return res.status(404).json({ error: "Product not found" });
        }

        await shoppingCart.addItemToCart(userId, productId, quantity);

        
        const updatedCart = await shoppingCart.getCartByUserId(userId);
        res.render('cart', { cartItems: updatedCart.items, cartTotal: updatedCart.total }); // render shoppingCart.handlebars
    } catch (error) {
        console.error(error);
        res.status(400).json({ error: error.message });
    }
});

// get the users cart
router.get('/cart/:userId', async (req, res) => {
    try {
        const userId = req.params.userId; 
        const cart = await shoppingCart.getCartByUserId(userId);
        res.render('cart', { cartItems: cart.items, cartTotal: cart.total }); // render shoppingCart.handlebars
    } catch (error) {
        console.error(error);
        res.status(400).json({ error: error.message });
    }
});

// put request for updating cart
router.put('/cart/update', async (req, res) => {
    try {
        const { userId, productId, quantity } = req.body;

        if (!userId || !productId || !quantity) {
            throw new Error("You are missing the required fields: userId, productId, quantity.");
        }

        await shoppingCart.updateItemQuantity(userId, productId, quantity);
        const updatedCart = await shoppingCart.getCartByUserId(userId);
        res.render('cart', { cartItems: updatedCart.items, cartTotal: updatedCart.total }); // render shoppingCart.handlebars
    } catch (error) {
        console.error(error);
        res.status(400).json({ error: error.message });
    }
});

// remove item from cart
router.delete('/cart/remove/:userId/:productId', async (req, res) => {
    try {
        const { userId, productId } = req.params;
        await shoppingCart.removeItemFromCart(userId, productId);
        const updatedCart = await shoppingCart.getCartByUserId(userId);
        res.render('cart', { cartItems: updatedCart.items, cartTotal: updatedCart.total }); // render shoppingCart.handlebars
    } catch (error) {
        console.error(error);
        res.status(400).json({ error: error.message });
    }
});

// remove cart entirely
router.delete('/cart/clear/:userId', async (req, res) => {
    try {
        const userId = req.params.userId;
        await shoppingCart.clearCart(userId);
        const updatedCart = await shoppingCart.getCartByUserId(userId);
        res.render('cart', { cartItems: updatedCart.items, cartTotal: updatedCart.total }); // render shoppingCart.handlebars
    } catch (error) {
        console.error(error);
        res.status(400).json({ error: error.message });
    }
});

export default router;
