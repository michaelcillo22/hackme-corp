import { ordersData } from '../config/mongoCollections.js';
import { ObjectId } from 'mongodb';

const seedOrders = async () => {
    const ordersCollection = await ordersData();
    const db = ordersCollection.s.db;

    // Drop the database
    await db.dropDatabase();

    // Sample orders
    const sampleOrders = [
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
        },
        {
            orderId: "ORD123458",
            orderStatus: "Delivered",
            firstName: "Alice",
            lastname: "Smith",
            buyerEmail: "alice.smith@example.com",
            buyerId: "c0000003",
            shippingAddress: "456 Elm Street, Chicago, IL 60601",
            contactNumber: "+1-312-555-1234",
            items: [
                { productId: "p004", productName: "Widget C", quantity: 1, vendorId: "v0004" }
            ],
            purchaseDate: "03012023"
        },
        {
            orderId: "ORD123459",
            orderStatus: "Cancelled",
            firstName: "Bob",
            lastname: "Johnson",
            buyerEmail: "bob.johnson@example.com",
            buyerId: "c0000004",
            shippingAddress: "789 Pine Street, Houston, TX 77002",
            contactNumber: "+1-713-555-5678",
            items: [
                { productId: "p005", productName: "Gadget Y", quantity: 2, vendorId: "v0005" }
            ],
            purchaseDate: "04012023"
        },
        {
            orderId: "ORD123460",
            orderStatus: "Processing",
            firstName: "Charlie",
            lastname: "Brown",
            buyerEmail: "charlie.brown@example.com",
            buyerId: "c0000005",
            shippingAddress: "101 Maple Avenue, Seattle, WA 98101",
            contactNumber: "+1-206-555-7890",
            items: [
                { productId: "p006", productName: "Widget D", quantity: 4, vendorId: "v0006" }
            ],
            purchaseDate: "05012023"
        },
        {
            orderId: "ORD123461",
            orderStatus: "Shipped",
            firstName: "Diana",
            lastname: "Prince",
            buyerEmail: "diana.prince@example.com",
            buyerId: "c0000006",
            shippingAddress: "202 Oak Street, Boston, MA 02108",
            contactNumber: "+1-617-555-4321",
            items: [
                { productId: "p007", productName: "Gadget Z", quantity: 1, vendorId: "v0007" }
            ],
            purchaseDate: "06012023"
        },
        {
            orderId: "ORD123462",
            orderStatus: "Delivered",
            firstName: "Eve",
            lastname: "Adams",
            buyerEmail: "eve.adams@example.com",
            buyerId: "c0000007",
            shippingAddress: "303 Birch Lane, Miami, FL 33101",
            contactNumber: "+1-305-555-6789",
            items: [
                { productId: "p008", productName: "Widget E", quantity: 3, vendorId: "v0008" }
            ],
            purchaseDate: "07012023"
        },
        {
            orderId: "ORD123463",
            orderStatus: "Processing",
            firstName: "Frank",
            lastname: "Castle",
            buyerEmail: "frank.castle@example.com",
            buyerId: "c0000008",
            shippingAddress: "404 Cedar Road, Denver, CO 80202",
            contactNumber: "+1-720-555-3456",
            items: [
                { productId: "p009", productName: "Widget F", quantity: 2, vendorId: "v0009" }
            ],
            purchaseDate: "08012023"
        },
        {
            orderId: "ORD123464",
            orderStatus: "Shipped",
            firstName: "Grace",
            lastname: "Hopper",
            buyerEmail: "grace.hopper@example.com",
            buyerId: "c0000009",
            shippingAddress: "505 Spruce Drive, Austin, TX 73301",
            contactNumber: "+1-512-555-9876",
            items: [
                { productId: "p010", productName: "Widget G", quantity: 5, vendorId: "v0010" }
            ],
            purchaseDate: "09012023"
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

// Execute seeding
seedOrders().catch((error) => {
    console.error("Error seeding orders:", error);
}).finally(() => {
    process.exit();
});
