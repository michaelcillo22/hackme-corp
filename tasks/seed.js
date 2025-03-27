import { MongoClient } from 'mongodb';

async function seedDatabase() {
    const dbName = 'CS546_FinalProject_Group2_Hackmazon';
    const collectionName = 'Orders';
    const orders = [
        {
            orderId: "ORD001",
            orderStatus: "Pending",
            firstName: "Alex",
            lastName: "Tribec",
            buyerEmail: "alex.tribec@example.com",
            buyerId: "BUY123",
            city: "New York",
            contactNumber: "123-456-7890",
            items: [
                { product_id: "PROD001", name: "Gaming Console", quantity: 1, price: 499.99 },
                { product_id: "PROD002", name: "Wireless Controller", quantity: 2, price: 59.99 }
            ],
            purchaseDate: new Date("2025-03-20"),
            ShippingAddress: "123 Gaming Street, NY 10001"
        },
        {
            orderId: "ORD002",
            orderStatus: "Shipped",
            firstName: "Steve",
            lastName: "Harvey",
            buyerEmail: "steve.harvey@example.com",
            buyerId: "BUY124",
            city: "Los Angeles",
            contactNumber: "987-654-3210",
            items: [
                { product_id: "PROD003", name: "Gaming Headset", quantity: 1, price: 79.99 },
                { product_id: "PROD004", name: "Keyboard", quantity: 1, price: 129.99 }
            ],
            purchaseDate: new Date("2025-03-22"),
            ShippingAddress: "456 Gaming Ave, CA 90001"
        },
        {
            orderId: "ORD003",
            orderStatus: "Delivered",
            firstName: "Pat",
            lastName: "Sajak",
            buyerEmail: "pat.sajak@example.com",
            buyerId: "BUY125",
            city: "Culver City",
            contactNumber: "555-666-7777",
            items: [
                { product_id: "PROD005", name: "Gaming Chair", quantity: 1, price: 199.99 }
            ],
            purchaseDate: new Date("2025-03-23"),
            ShippingAddress: "789 Gamer Lane, CA 90232"
        }
    ];

    try {
        await client.connect();
        const db = client.db(dbName);
        const collection = db.collection(collectionName);

        const result = await collection.insertMany(orders);
        console.log(`${result.insertedCount} orders inserted!`);
    } catch (error) {
        console.error("Error seeding database:", error);
    } finally {
        await client.close();
    }
}

seedDatabase();
