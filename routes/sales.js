import {Router} from 'express';
import * as sales from "../data/sales.js"
import * as helpers from "../helpers_kh.js";

const router = Router();

//get all sales for a business with userId
router.route('/userId').get(async (req, res) => {
    try {
        
    } catch (error) {
        return res.status(500).json({error: error});
    }
  });

  //get a specific sale with saleId
router.route('/userId/id').get(async (req, res) => {
    
    })
//delete a sale with saleId made to a business with userId
.delete(async (req, res) => {

    });

//get all sales made by buyer with buyerId at business with userId
router.route('/userId/buyerId').get(async (req, res) => {
    
    });





//export router
export default router;