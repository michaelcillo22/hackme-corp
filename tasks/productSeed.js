// TO DO:
import {dbConnection, closeConnection} from '../config/mongoConnection.js';
import products from '../data/products.js';

const db = await dbConnection();
await db.dropDatabase();