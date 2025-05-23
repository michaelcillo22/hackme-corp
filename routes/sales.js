import {Router} from 'express';
import {salesData} from "../data/index.js"
import * as helpers from "../helpers/helpers_kh.js";

const router = Router();

//create sale
router.route('/sale').post(async (req, res) => {
    try {
        const {
            orderId,
            buyerId,
            totalAmount,
            paymentMethod,
            paymentStatus,
            transactionId,
            salesDate,
            items
        } = req.body;

        if(!orderId || !buyerId || !totalAmount || !paymentMethod || !paymentStatus || !transactionId || !salesDate || !items) throw "All fields are Required.";

    } catch (error) {
        return res.status(400).json({error: error.message});
    }

    try {
        const sale = await salesData.createSale(orderId,
            buyerId,
            totalAmount,
            paymentMethod,
            paymentStatus,
            transactionId,
            salesDate,
            items);
        if(!sale) throw "Unable to create a new sale.";
        //add redirect
    } catch (error) {
        return res.status(400).json({error: error.message});
    }

});

//get all sales data for a business with userId
router.route('/:userId').get(async (req, res) => {
    //ensure userId is a valid string input
    let user;
    try {
        user = helpers.stringCheck(req.params.userId);
        console.log("Vendor ID (userId):", user);
    } catch (error) {
        //redirect to the login page
        return res.redirect('/login');
    }
    try {
        const salesList = await salesData.getSaleByVendorId(user);
        const analytics = await salesData.analytics(user);
        return res.render('dashboard', {title: "Dashboard", sales: salesList, analytics: analytics});
    } catch (error) {
        return res.status(400).json({error: error.message});
    }
});

  //get a specific sale with saleId
router.route('/:id')
/*.get(async (req, res) => {
    //ensure SaleId is a valid object id
    try {
        let s = helpers.stringCheck(req.params.id);
        if (!ObjectId.isValid(s)) throw 'invalid object ID'; 
    } catch (error) {
        return res.status(400).json({error: error.message});
    }
    try {
        let sale = await salesData.getSaleById(s);
        return res.render('sale', {sale: sale});
    } catch (error) {
        return res.status(400).json({error: error.message});
    }
}) */
.delete(async (req, res) => {
    //ensure SaleId is a valid object id
    try {
        let s = helpers.stringCheck(req.params.saleId);
        if (!ObjectId.isValid(s)) throw 'invalid object ID'; 
    } catch (error) {
        return res.status(400).json({error: error.message});
    }
    try {
        let sale = await salesData.removeSale(s);
        if(!sale) throw `Could not remove sale with sale Id ${s}`;
        //add redirect
    } catch (error) {
        return res.status(400).json({error: error.message});
    }
});

//export router
export default router;