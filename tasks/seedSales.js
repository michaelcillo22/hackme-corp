
import { dbConnection, closeConnection } from '../config/mongoConnection.js';
import salesMethods from '../data/sales.js';
import {ObjectId} from "mongodb";


export const seedSales = async () => {
    try {
        const sale1 = await salesMethods.createSale(new ObjectId().toString(),
            new ObjectId().toString(), 
            48.25,
            "apple pay",
            "paid",
            new ObjectId().toString(),
            new Date(),
            ["keyboard", "laptop"]
        );
        const sale2 = await salesMethods.createSale(new ObjectId().toString(),
            new ObjectId().toString(),
            12.35,
            "credit card",
            "pending",
            new ObjectId().toString(),
            new Date(),
            ["computer mouse"]
        );
        const sale3 = await salesMethods.createSale(new ObjectId().toString(),
            new ObjectId().toString(),
            50.40,
            "paypal",
            "refunded",
            new ObjectId().toString(),
            new Date(),
            ["headphones", "phone charger"]
        );
        const sale4 = await salesMethods.createSale(new ObjectId().toString(),
            new ObjectId().toString(),
            100.00,
            "credit card",
            "paid",
            new ObjectId().toString(),
            new Date(),
            ["earbuds", "keyboard", "monitor"]
        );
        const sale5 = await salesMethods.createSale(new ObjectId().toString(),
            new ObjectId().toString(),
            200.79,
            "apple pay",
            "pending",
            new ObjectId().toString(),
            new Date(),
            ["used laptop"]
        );
    } catch (error) {
        console.log("Error running seedSales.js: " + error.message);
    }
};

/*
    orderId, //object id of the order
    buyerId,  //object id of the customer 
    totalAmount, // numerical value
    paymentMethod,  // values can be "Credit Card", "PayPal", "Apple Pay"
    paymentStatus,  // values can be "Paid", "Pending", "Refunded"
    transactionId,  //id of the payment method used
    salesDate,  //date in the format YYYY-MM-DD
    items  //array of items purchased from this sale
    */