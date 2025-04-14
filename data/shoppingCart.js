// shoppingCart.js
import { ObjectId } from "mongodb";
import { carts } from "../config/mongoCollection.js";
import helpers from "../helpers_CD.js";

const shoppingCartMethods = {
    
    async getCartByUserId(userId) {
        userId = helpers.checkString(userId, "User ID");

        const cartCollection = await carts();
        const cart = await cartCollection.findOne({ userId });

        if (!cart) {
            return { userId, items: [] }; 
        }

        return cart;
    },

    // Add item to cart
    async addItemToCart(userId, productId, quantity) {
        userId = helpers.checkString(userId, "User ID");
        productId = helpers.checkId(productId, "Product ID");

        if (typeof quantity !== "number" || quantity <= 0) {
            throw new Error("Quantity must be a positive number.");
        }

        const cartCollection = await carts();
        const cart = await cartCollection.findOne({ userId });

        if (!cart) {
            // Create a new cart 
            const newCart = { userId, items: [{ productId, quantity }] };
            await cartCollection.insertOne(newCart);
            return newCart;
        }

        const existingItem = cart.items.find(item => item.productId === productId);
        if (existingItem) {
            existingItem.quantity += quantity; 
        } else {
            cart.items.push({ productId, quantity });
        }

        await cartCollection.updateOne({ userId }, { $set: { items: cart.items } });
        return cart;
    },

    // Remove item from cart
    async removeItemFromCart(userId, productId) {
        userId = helpers.checkString(userId, "User ID");
        productId = helpers.checkId(productId, "Product ID");

        const cartCollection = await carts();
        const cart = await cartCollection.findOne({ userId });

        if (!cart) throw new Error("Cart not found.");

        const updatedItems = cart.items.filter(item => item.productId !== productId);

        await cartCollection.updateOne({ userId }, { $set: { items: updatedItems } });
        return await this.getCartByUserId(userId);
    },

    // Update quantity of the item in the cart
    async updateItemQuantity(userId, productId, quantity) {
        userId = helpers.checkString(userId, "User ID");
        productId = helpers.checkId(productId, "Product ID");

        if (typeof quantity !== "number" || quantity <= 0) {
            throw new Error("Quantity must be a positive number.");
        }

        const cartCollection = await carts();
        const cart = await cartCollection.findOne({ userId });

        if (!cart) throw new Error("Cart not found.");

        const itemIndex = cart.items.findIndex(item => item.productId === productId);
        if (itemIndex === -1) throw new Error("Product not found in cart.");

        cart.items[itemIndex].quantity = quantity;

        await cartCollection.updateOne({ userId }, { $set: { items: cart.items } });
        return cart;
    },

    async clearCart(userId) {
        userId = helpers.checkString(userId, "User ID");

        const cartCollection = await carts();
        await cartCollection.updateOne({ userId }, { $set: { items: [] } });

        return { userId, items: [] };
    },
};

export default shoppingCartMethods;
