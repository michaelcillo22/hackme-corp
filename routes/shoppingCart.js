import {products} from "../config/mongoCollections.js";
import { ObjectId } from "mongodb";
import {Router} from "express";
import {shoppingCart} from "../data/index.js";

const router = Router();

// get the users cart
router.get('/cart/:userId', async (req, res) => {
    try {
        const userId = req.params.userId; 
        const cart = await shoppingCart.getCartByUserId(userId);

        const productCollection = await products();
        const allProducts = await productCollection.find({}).toArray();
        res.json(cart);
    } catch (error) {
        console.error(error);
        res.status(400).json({ error: error.message });
    }
});

// add item to cart
router.post('/cart/add', async (req, res) => {
    try {
        const { userId, productId, quantity } = req.body;

        if (!userId || !productId || !quantity) {
            throw new Error("Missing required fields: userId, productId, quantity.");
        }

        const productCollection = await products();
        const product = await productCollection.findOne({_id: new ObjectId(productId)});
        if (!product) {
            return res.status(404).json({ error: "Product not found" });
        }
        await shoppingCart.addItemToCart(userId, productId, quantity);
        const updatedCart = await shoppingCart.getCartByUserId(userId);
        let totalPrice = updatedCart.items.reduce((total, item) => total + (item.price * item.quantity), 0);
        res.json(updatedCart); 
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
        res.json(updatedCart);
    } catch (error) {
        console.error(error);
        res.status(400).json({ error: error.message });
    }
});

export default router;
