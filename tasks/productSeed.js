// TO DO:
import {dbConnection, closeConnection} from '../config/mongoConnection.js';
import products from '../data/products.js';

const db = await dbConnection();
await db.dropDatabase();

// Test createProduct
console.log("Creating our first product!");
const iBookG4 = await products.createProduct(
    "Laptop",    
    "Apple",      
    "iBook G4",        
    "iBook G4 runs Apple's PowerPC G4 processor.", 
    120.99,       
    ["https://usedmac.com/wp-content/uploads/2007/04/ibook_g4_mid_2005.jpg"],  
    "Used",    
    "In stock",    
)

console.log("Creating our second product!");
const powerBookG4 = await products.createProduct(
    "Laptop",    
    "Apple",      
    "PowerBook G4",        
    "PowerBook G4 runs Apple's PowerPC G4 processor.", 
    210.99,       
    ["https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQqFc3P--o6t8WfBTBBv3L6t0jFGXSgAFwM3Q&s"],  
    "Used",    
    "In stock",    
)

console.log("Finished seeding product database!");

await closeConnection();