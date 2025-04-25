import { carts } from "../config/mongoCollection.js";
import { products } from "../config/mongoCollection.js";
import { ObjectId } from "mongodb";
import { Router } from "express";
import shoppingCartMethods from "../data/shoppingCart.js";
import * as helpers from "../helpers/helpers_CD.js";
import { encryptCardData } from "../helpers/checkoutEncryption.js";
import { orders } from "../config/mongoCollection.js";

const router = Router();

router.get("/checkout/:userId", async (req, res) => {
    try {
        const userId = helpers.checkString(req.params.userId, "User ID");
        const cart = await shoppingCartMethods.getCartByUserId(userId);

        if (!cart.items.length) {
            return res.status(400).json({ error: "Your cart is empty! Add items to cart."});
        }
        res.status(200).json(cart);
    } catch (error) {
        console.error(error);
        res.status(404).json({ error: "Unable to retrieve cart!"});
    }
});

router.post("/checkout/confirm", async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ error: "User is not authenticated!" });
        }

        const userId = helpers.checkString(req.params.userId, "User ID");
        const cart = await shoppingCartMethods.getCartByUserId(userId);

        if (!cart.items.length) {
            return res.status(400).json({ error: "Your cart is empty! Add items before checkout." });
        }

        const paymentData = req.body.paymentData;
        if (!paymentData || !paymentData.cardNumber || !paymentData.expirationDate || !paymentData.cvv) {
            return res.status(400).json({ error: "Missing payment details!" });
        }

        // Encrypt payment details using crypto before storing in mongodb
        const encryptPaymentData = encryptCardData(paymentData);

        const orderCollection = await orders();
        const newOrder = {
            userId,
            items: cart.items,
            status: "Completed",
            paymentData: encryptPaymentData,
            createdAt: new Date(),
        };

        await orderCollection.insertOne(newOrder);
        await shoppingCartMethods.clearCart(userId);

        res.status(200).json({ message: "Checkout was successful! Your order has been placed!" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error occurred during checkout." });
    }
});

export default router;
