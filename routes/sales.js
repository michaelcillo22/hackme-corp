import {Router} from 'express';
import salesData from "../data/index.js"
import * as helpers from "../helpers_kh.js";

const router = Router();

//get all sales data for a business with userId
router.route('/userId').get(async (req, res) => {
    //ensure userId is a valid string input
    try {
        let user = helpers.stringCheck(req.params.userId);
    } catch (error) {
        //redirect to the login page
        res.redirect('/login');
    }
    try {
        const salesList = await salesData.getSaleByVendorId(user);
        res.render('dashboard', {sales: salesList});
    } catch (error) {
        return res.status(400).json({error: error});
    }
});

  //get a specific sale with saleId
router.route('/userId/saleId').get(async (req, res) => {
    //ensure SaleId is a valid object id
    try {
        let s = helpers.stringCheck(req.params.saleId);
        if (!ObjectId.isValid(s)) throw 'invalid object ID'; 
    } catch (error) {
        return res.status(400).json({error: error});
    }
    try {
        let sale = await salesData.getSaleById(s);
        res.render('sale', {sale: sale});
    } catch (error) {
        return res.status(400).json({error: error});
    }
})
.delete(async (req, res) => {
    //ensure SaleId is a valid object id
    try {
        let s = helpers.stringCheck(req.params.saleId);
        if (!ObjectId.isValid(s)) throw 'invalid object ID'; 
    } catch (error) {
        return res.status(400).json({error: error});
    }
    try {
        let sale = await salesData.removeSale(s);
        if(!sale) throw `Could not remove sale with sale Id ${s}`;
    } catch (error) {
        return res.status(400).json({error: error});
    }
});

//get all sales made by buyer with buyerId at business with userId
router.route('/userId/buyerId').get(async (req, res) => {
    
});





//export router
export default router;