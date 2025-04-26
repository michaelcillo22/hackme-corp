
import { dbConnection, closeConnection } from '../config/mongoConnection.js';
import {sales} from '../config/mongoCollections.js';
import * as salesMethods from '../data/sales.js';
import userMethods from '../data/users.js';
import {createProduct} from '../data/products.js'; 
import {ObjectId} from "mongodb";


export const seedSales = async () => {
    const db = await dbConnection();
    console.log("Seeding sales collection...");
    //get vendor IDs
    let vendor;
    try {
        vendor = await userMethods.createUser('kayla@example.com',
            'Kayla',
            'Thisismypasword123!',
            'seller'
        );
    } catch (error) {
        console.log("Error running seedSales.js: " + error.message);
    }
    //create products to use for sales data
    let product1, product2, product3, product4;
console.log(product1);
console.log(product2);
console.log(product3);
console.log(product4);
    try {
        product1 = await createProduct("Hardware",
            vendor._id.toString(),
            'AULA 99 Key Keyboard',
            'A bluetooth gaming keyboard',
            42.74,
            ['https://a.media-amazon.com/images/I/61Ze1sJ7z4L._AC_SL1500_.jpg'],
            'New',
            'In stock'
        );
         product2 = await createProduct('Hardware',
            vendor._id.toString(),
            'JBL Tune 510BT',
            'Bluetooth headphones with a 40 hour battery life',
            49.95,
            ['https://a.media-amazon.com/images/I/31zhhOw6cDL._AC_.jpg'],
            'New',
            'In stock'
        );
        product3 = await createProduct('Hardware',
            vendor._id.toString(),
            'Logitech M185 Wireless Mouse',
            'A wireless USB computer mouse',
            13.99,
            ['https://a.media-amazon.com/images/I/5181UFuvoBL._AC_SL1500_.jpg'],
            'New',
            'In stock'
        );
        product4 = await createProduct('Hardware',
            vendor._id.toString(),
            'Sceptre 20 1600x900 75Hz Ultra Thin LED Monitor',
            'LED computer monitor',
            60.99,
            ['https://a.media-amazon.com/images/I/61oepG5Y2FL._AC_SL1313_.jpg'],
            'New',
            'In stock'
        );
    } catch (error) {
        console.log("Error running seedSales.js: " + error.message);
    }

    //create sales data
    let sale1, sale2, sale3, sale4, sale5;
    try {
        sale1 = await salesMethods.createSale(new ObjectId().toString(),
            new ObjectId().toString(), 
            103.73,
            "apple pay",
            "paid",
            new ObjectId().toString(),
            new Date(),
            [product1, product4]
        );
        sale2 = await salesMethods.createSale(new ObjectId().toString(),
            new ObjectId().toString(),
            13.99,
            "credit card",
            "pending",
            new ObjectId().toString(),
            new Date(),
            [product3]
        );
        sale3 = await salesMethods.createSale(new ObjectId().toString(),
            new ObjectId().toString(),
            63.94,
            "paypal",
            "refunded",
            new ObjectId().toString(),
            new Date(),
            [product2, product3]
        );
        sale4 = await salesMethods.createSale(new ObjectId().toString(),
            new ObjectId().toString(),
            92.69,
            "credit card",
            "paid",
            new ObjectId().toString(),
            new Date(),
            [product1, product2]
        );
        sale5 = await salesMethods.createSale(new ObjectId().toString(),
            new ObjectId().toString(),
            13.99,
            "apple pay",
            "pending",
            new ObjectId().toString(),
            new Date(),
            [product3]
        );
    } catch (error) {
        console.log("Error running seedSales.js: " + error.message);
    }
    console.log(sale1);
    console.log("Seeding sales done!");
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