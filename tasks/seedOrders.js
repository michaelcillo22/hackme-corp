import { ordersData, products } from '../config/mongoCollections.js';
import { ObjectId } from 'mongodb';
import {users} from "../config/mongoCollections.js";

export const seedOrders = async () => {
    const ordersCollection = await ordersData();
    const db = ordersCollection.s.db;

    // Drop the database
    // await db.dropDatabase();

    // Sample orders
    console.log("Gathering available users!");
    let availUsers = await users();
    let listUsers = await availUsers.find({}).toArray();

    // Select users to review for example
    let [mariahReview, britneyReview, avaReview] = listUsers;
    let mariahId = mariahReview._id.toString();
    let britneyId = britneyReview._id.toString();
    let avaId = avaReview._id.toString();

    console.log("Gathering available products!");
    let availProducts = await products();
    let listProducts = await availProducts.find({}).toArray();

    let [product1, product2, product3] = listProducts;

    const sampleOrders = [
        {
            orderId: "ORD100456",
            orderStatus: "Shipped",
            firstName: "John",
            lastname: "Doe",
            buyerEmail: "user1@example.com",
            buyerId: mariahId,
            shippingAddress: "111 Broadway, New York, New York 10038",
            contactNumber: "+1-123-456-7890",
            items: [
                { productId: product1._id, productName: product1.name, quantity: 2, vendorId: "v0001" }
            ],
            purchaseDate: "01012023"
        },
        {
            orderId: "ORD123456",
            orderStatus: "Shipped",
            firstName: "MJ",
            lastname: "Cillo",
            buyerEmail: "johndoe@example.com",
            buyerId: "c0000001",
            shippingAddress: "222 Broadway, New York, New York 10038",
            contactNumber: "+1-123-456-7890",
            items: [
                { productId: "p001", productName: "Widget A", quantity: 2, vendorId: "v0001" },
                { productId: "p002", productName: "Widget B", quantity: 1, vendorId: "v0002" }
            ],
            purchaseDate: "01012023"
        },
        {
            orderId: "ORD123457",
            orderStatus: "Processing",
            firstName: "Jane",
            lastname: "Doe",
            buyerEmail: "janedoe@example.com",
            buyerId: "c0000002",
            shippingAddress: "123 Main Street, Los Angeles, CA 90001",
            contactNumber: "+1-987-654-3210",
            items: [
                { productId: "p003", productName: "Gadget X", quantity: 3, vendorId: "v0003" }
            ],
            purchaseDate: "02012023"
        }
    ];

    // Insert sample orders
    const insertResult = await ordersCollection.insertMany(sampleOrders);
    if (insertResult.acknowledged) {
        console.log(`${insertResult.insertedCount} orders seeded successfully.`);
    } else {
        console.error("Failed to seed orders.");
    }
};

// // Execute seeding
// // seedOrders().catch((error) => {
// //     console.error("Error seeding orders:", error);
// // })
