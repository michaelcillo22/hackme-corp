
import {ObjectId} from 'mongodb';
import * as helpers from "../helpers/helpers_kh.js";
import {sales} from '../config/mongoCollections.js';
import {products} from '../config/mongoCollections.js';

//uses given params to create new sale with unique object id
export const createSale = async (
    orderId, //object id of the order
    buyerId,  //object id of the customer 
    totalAmount, // numerical value
    paymentMethod,  // values can be "Credit Card", "PayPal", "Apple Pay"
    paymentStatus,  // values can be "Paid", "Pending", "Refunded"
    transactionId,  //id of the payment method used
    salesDate,  //date in the format YYYY-MM-DD
    items  //array of items purchased from this sale
) => {

    //input validation
    //ensure all string values are nonempty strings
    orderId = helpers.stringCheck(orderId);
    buyerId = helpers.stringCheck(buyerId);
    transactionId = helpers.stringCheck(transactionId);
    paymentMethod = helpers.stringCheck(paymentMethod);
    paymentStatus = helpers.stringCheck(paymentStatus);

    //ensure valid objectId
    if(!ObjectId.isValid(orderId)) throw 'Invalid object id';
    if(!ObjectId.isValid(buyerId)) throw 'Invalid object id';
    if(!ObjectId.isValid(transactionId)) throw 'Invalid object id';

    //ensure totalAmount is a positive number
    totalAmount = helpers.checkNum(totalAmount);

    //ensure paymentMethod and PaymentStatus are appropriate values
    paymentMethod = helpers.checkPaymentMethod(paymentMethod);
    paymentStatus = helpers.checkPaymentStatus(paymentStatus);

    //ensure date is valid
    if(isNaN(salesDate.getTime())) throw 'Not a valid date format.';

    //ensure items is an array with all values being prduct objects
    if(!Array.isArray(items)) throw 'You must supply an array of items';

    //create new sale
    let sale = {
        orderId: orderId,
        buyerId: buyerId,
        totalAmount: totalAmount,
        paymentMethod: paymentMethod,
        paymentStatus: paymentStatus,
        transactionId: transactionId,
        salesDate: salesDate,
        items: items
    };

    //add sale to the collection
    const salesCollection = await sales();
    const insertSale = await salesCollection.insertOne(sale);
    if(!insertSale.acknowledged || !insertSale.insertedId) throw 'Could not add sale';

    const newId = insertSale.insertedId.toString();
    const newSale = await getSaleById(newId);
    return newSale;

};

//returns sale with given saleId
export const getSaleById = async (saleId) => {

    //input validation
    saleId = helpers.stringCheck(saleId);
    if(!ObjectId.isValid(saleId)) throw 'Invalid object id';

    //search collection for the sale
    const salesCollection = await sales();
    let sale = await salesCollection.findOne({_id: new ObjectId(saleId)});
    if(sale === null) throw 'Could not find a sale with this id';
    sale._id = sale._id.toString();
    return sale;

};

//returns sale with given orderId
export const getSaleByOrderId = async (orderId) => {

    //input validation
    orderId = helpers.stringCheck(orderId);
    if(!ObjectId.isValid(orderId)) throw 'Invalid object id';

    //search collection for the sale
    const salesCollection = await sales();
    let sale  = await salesCollection.findOne({orderId: orderId});
    if(sale === null) throw 'Could not find a sale with this orderId';

    sale = sale.map((element) => {
        element._id = element._id.toString();
        return element;
      });

    return sale;

};

//returns one or more sales with given buyerId
export const getSaleByBuyerId = async (buyerId) => {

    //input validation
    buyerId = helpers.stringCheck(buyerId);
    if(!ObjectId.isValid(buyerId)) throw 'Invalid object id';

    //search collection for the sale
    const salesCollection = await sales();
    let sale = await salesCollection.find({buyerId: buyerId}).toArray();
    if(sale === null) throw 'Could not find a sale with this buyerId';

    sale = sale.map((element) => {
        element._id = element._id.toString();
        return element;
      });

    return sale;

};

//returns one or more sales with a given vendor id
export const getSaleByVendorId = async (vendorId) => {
    //input validation
    vendorId = helpers.stringCheck(vendorId);
    if(!ObjectId.isValid(vendorId)) throw 'Invalid object id';

    //search collection for the sale
    const salesCollection = await sales();
    let sale = await salesCollection.find({items: {$elemMatch: {vendor: new ObjectId(vendorId)}}}).toArray();
    console.log("Sales for Vendor ID:", vendorId, sale);
    if(sale === null) throw 'Could not find a sale with this vendorId';

    sale = sale.map((element) => {
        element._id = element._id.toString();
        return element;
      });
    return sale;
};

//delete sale with the given saleId from the collection
export const removeSale = async (saleId) => {

    //input validation
    saleId = helpers.stringCheck(saleId);
    if(!ObjectId.isValid(saleId)) throw 'Invalid object id';

    //search collection for the sale
    const salesCollection = await sales();
    const sale = await salesCollection.findOneAndDelete({_id: new ObjectId(saleId)});
    if(sale === null) throw 'Could not delete sale.';
    return sale._id.toString() + " has been successfully deleted!";

};

//analytic data for vendor dashboards
export const analytics = async (vendorId) => {
    //input validation
    vendorId = helpers.stringCheck(vendorId);
    if(!ObjectId.isValid(vendorId)) throw 'Invalid object id';

    let sales = await getSaleByVendorId(vendorId);
    let numOfsales = sales.length;

    //find and store only those products sold by the vendor
    let salesArr = [];
    let total = 0;
    for(let sale of sales){
        let products = sale.items;
        for(let product of products){
            console.log("Product Vendor:", product.vendor, "Type:", typeof product.vendor);
            console.log("Vendor ID:", vendorId, "Type:", typeof vendorId);
            if(product.vendor.toString() === vendorId){
                salesArr.push(product);
                total += product.price;
            }
        }
    }
    let productsSold = salesArr.length;
    total = total.toFixed(2);

    let popularity = {};
    for(let product of salesArr){
        let name = product.name;
        if(Object.hasOwn(popularity, name)){
            popularity[name] = popularity[name] + 1;
        } else {
            popularity[name] = 1;
        }
    }
    //find most and least popular products
    let most = -1;
    let least = Number.MAX_VALUE;
    let mostPopular;
    let leastPopular;
    for(let [product, pop] of Object.entries(popularity)){
        if(pop > most){
            most = pop;
            mostPopular = product;
        }
        if(pop < least){
            least = pop;
            leastPopular = product;
        }
    }

    const stats = {
        numOfSales: numOfsales,
        productsSold: productsSold,
        total: total,
        leastPopular: leastPopular,
        mostPopular: mostPopular
    }
    return stats;
};