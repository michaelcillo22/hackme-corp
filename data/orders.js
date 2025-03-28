import { ordersData } from '../config/mongoCollections.js';
import { ObjectId } from 'mongodb';

const ordersExample = [
    {},
    {},
    {},
    // ... other orders
];

const exportedMethods = {
    async getOrderById(orderId) {
        if (!orderId) throw new Error("You must provide an order ID");
        if (typeof orderId !== 'string') throw new Error("Order ID must be a string");
        if (!ObjectId.isValid(orderId)) throw new Error("Invalid order ID format");

        const ordersCollection = await ordersData();
        const order = await ordersCollection.findOne({ _id: new ObjectId(orderId) });
        if (!order) throw new Error(`No order found with ID: ${orderId}`);

        return order;
    },

    async createOrder(order) {
        if (!order || typeof order !== 'object') throw new Error("Order must be a valid object");

        const requiredFields = [
            "orderId", "orderStatus", "firstName", "lastname", 
            "buyerEmail", "buyerId", "shippingAddress", 
            "contactNumber", "items", "purchaseDate"
        ];
        for (const field of requiredFields) {
            if (!order[field]) throw new Error(`Missing required field: ${field}`);
        }

        if (!Array.isArray(order.items)) throw new Error("Items must be an array");

        const ordersCollection = await ordersData();
        const insertResult = await ordersCollection.insertOne(order);
        if (!insertResult.acknowledged || !insertResult.insertedId) {
            throw new Error("Failed to create order");
        }

        order._id = insertResult.insertedId;
        return order;
    },

// TODO: getAllOrdersByVendor(vendorId)

// TODO: removeOrder()

// TODO: updateOrder()

// TODO:
}

export default exportedMethods;