import { carts } from "../config/mongoCollection.js";
import { products } from "../config/mongoCollection.js";
import { ObjectId } from "mongodb";
import { Router } from "express";
import stripe from "../config/stripe.js";
const router = Router();

router.post("/checkout", async (req, res) => {
    try {
        const { userId, paymentMethodId } = req.body;

        if (!userId || !paymentMethodId) {
            throw new Error("User and Payment Method ID are required.");
        }

        const cartCollection = await carts();
        const cart = await cartCollection.findOne({ userId });

        if (!cart || cart.items.length === 0) {
            return res.status(400).json({ error: "Cannot checkout an empty cart!" });
        }

        let total = 0;
        for (const item of cart.items) {
            const product = await products.findOne({ _id: new ObjectId(item.productId) });
            if (!product) {
                return res.status(404).json({ error: `Product ID ${item.productId} not found.` });
            }
            total += product.price * item.quantity;
        }

        // Process payment with Stripe
        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(total * 100),
            currency: "usd",
            payment_method: paymentMethodId,
            confirm: true
        });

        // Payment Successful - Clear Cart
        await cartCollection.updateOne({ userId }, { $set: { items: [] } });

        res.status(200).json({
            message: "Payment was successful! Clearing Cart.",
            transactionId: paymentIntent.id,
            totalAmountPaid: total
        });

    } catch (error) {
        console.error(error);
        res.status(400).json({ error: error.message });
    }
});

export default router;
