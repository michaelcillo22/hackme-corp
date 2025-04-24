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

        const updatedCart = await shoppingCart.addItemToCart(userId, productId, quantity);
        res.status(200).json(updatedCart);
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
        res.status(200).json(cart);
    } catch (error) {
        console.error(error);
        res.status(400).json({ error: err.message });
    }
});

// put request for updating cart
router.put('/cart/update', async (req, res) => {
    try {
        const { userId, productId, quantity } = req.body;

        if (!userId || !productId || !quantity) {
            throw new Error("You are missing the required fields: userId, productId, quantity.");
        }

        const updatedCart = await shoppingCart.updateItemQuantity(userId, productId, quantity);
        res.status(200).json(updatedCart);
    } catch (error) {
        console.error(error);
        res.status(400).json({ error: err.message });
    }
});

// remove item from cart
router.delete('/cart/remove/:userId/:productId', async (req, res) => {
    try {
        const { userId, productId } = req.params;

        const updatedCart = await shoppingCart.removeItemFromCart(userId, productId);
        res.status(200).json(updatedCart);
    } catch (error) {
        console.error(error);
        res.status(400).json({ error: err.message });
    }
});

// remove cart entirely
router.delete('/cart/clear/:userId', async (req, res) => {
    try {
        const userId = req.params.userId;

        const clearedCart = await shoppingCart.clearCart(userId);
        res.status(200).json(clearedCart);
    } catch (error) {
        console.error(error);
        res.status(400).json({ error: err.message });
    }
});

export default router;
