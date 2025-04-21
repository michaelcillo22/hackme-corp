// TO DO:
import {dbConnection, closeConnection} from '../config/mongoConnection.js';
import * as products from '../data/products.js';
import * as reviews from '../data/reviews.js';
import {users} from "../config/mongoCollections.js";

const db = await dbConnection();
// await db.dropDatabase();

// Test createProduct
export async function productReviewSeed() {

    // Gather users. Then create our products first and their reviews
    try {
        console.log("Gathering available users!");
        let availUsers = await users();
        let listUsers = await availUsers.find({}).toArray();

        // Select users to review for example
        let [mariahReview, britneyReview] = listUsers;
        let mariahId = mariahReview._id.toString();
        let britneyId = britneyReview._id.toString();

        // Now let's create our products and reviews
        console.log("Creating our first product!");
        const iBookG4 = await products.createProduct(
            "Technology",    
            "Apple",      
            "iBook G4",        
            "iBook G4 runs Apple's PowerPC G4 processor.", 
            120.99,       
            ["https://usedmac.com/wp-content/uploads/2007/04/ibook_g4_mid_2005.jpg"],  
            "Used",    
            2,    
        )
    
        console.log("Creating our second product!");
        const powerBookG4 = await products.createProduct(
            "Technology",    
            "Apple",      
            "PowerBook G4",        
            "PowerBook G4 runs Apple's PowerPC G4 processor.", 
            210.99,       
            ["https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQqFc3P--o6t8WfBTBBv3L6t0jFGXSgAFwM3Q&s"],  
            "Used",    
            0,    
        )  

        // Make reviews
        console.log("Creating our first review now!");
        const iBookG4Review = await reviews.createReview(
            iBookG4._id.toString(), 
            true,             
            mariahReview.userName || mariahReview.username || "Mariah",  
            mariahId, 
            "LOVE IT!",                                                     
            4.5,                                                         
            "Absolutely love the iBook!"
        )

        console.log("Creating our second review now!");
        const powerBookG4Review = await reviews.createReview(
            powerBookG4._id.toString(), 
            true,             
            britneyReview.userName || britneyReview.username || "Britney",  
            britneyId, 
            "It's so slow omg",                                                     
            2.2,                                                         
            "Like I know it's old, but it's still slow so..."
        )

    } catch (e) {
        console.log (e);
    } finally {
        // await closeConnection();
        console.log("\nFinished seeding product database! :)");
    }
}