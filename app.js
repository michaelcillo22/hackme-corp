import { ConnectionClosedEvent } from 'mongodb';
import {dbConnection, closeConnection} from './config/mongoConnection.js';
import { ObjectId } from 'mongodb';
import * as sales from "./data/sales.js";

const db = await dbConnection();
await db.dropDatabase();

let sale1;
let sale2;
let sale3;

let sale1buyer;
let sale1order;
let sale1Id;

try {
    let sale1 = await sales.createSale(new ObjectId().toString(), new ObjectId().toString(), "40.00", "credit card", "paid", new ObjectId().toString(), new Date(), ["keyboard"]);
    sale1Id = sale1._id.toString();
    sale1buyer = sale1.buyerId;
    sale1order = sale1.orderId;
    console.log(sale1);
} catch (error) {
    console.log(error);
}

try {
    let sale2 = await sales.createSale(new ObjectId().toString(), new ObjectId().toString(), "75.54", "paypal", "pending", new ObjectId().toString(), new Date(), ["keyboard", "microphone"]);
    console.log(sale2);
} catch (error) {
    console.log(error);
}

try { //error case
    let sale3 = await sales.createSale(new ObjectId().toString(), new ObjectId().toString(), "hello", "paypal", "pending", new ObjectId().toString(), new Date(), ["keyboard", "microphone"]);
    console.log(sale2);
} catch (error) {
    console.log(error);
}

try { //test get methods
    let getSale1 = await sales.getSaleByBuyerId(sale1buyer);
    console.log(getSale1);
} catch (error) {
    console.log(error);
}

try { //test get methods
    let getSale2 = await sales.getSaleByOrderId(sale1order);
    console.log(getSale2);
} catch (error) {
    console.log(error);
}

try { //test remove method
    let test = await sales.removeSale(sale1Id);
    console.log(test);
} catch (error) {
    console.log(error);
}

await closeConnection();