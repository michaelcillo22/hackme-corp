// Export the following functions using ES6 Syntax
import * as helpers from "../helpers.js";
import {products} from "../config/mongoCollections.js";
import {ObjectId} from "mongodb";

// Listing a product
export const createProduct = async (
  category,
  vendor,
  name,
  description,
  pricing,
  photos,
  condition,
  status
) => {
  
  // Maybe just use helpers file for validation checks
  if ( !category
    || !vendor
    || !name
    || !description
    || !pricing
    || !photos
    || !condition
    || !status) {
    throw "Oh no! One or more of the input fields are not provided :(";
  }
};

// Populate all of our products from inventory
export const getAllProducts = async () => {

  // Initialize our product collection
  const productCollection = await products();

  // Intiialzie our product array list
  let ourProductList = await productCollection.find({}).toArray();

  // Check if product array is empty, we should return empty
  if (ourProductList.length === 0) {
    return [];
  }

  // Use map as utilized in lecture 4
  ourProductList = ourProductList.map((productElement) => {
    productElement._id = productElement._id.toString();
    return productElement;
  });

  return ourProductList;
};

// Get Product ID
export const getProductById = async (movieId) => {

};

// Remove product from inventory
export const removeProduct = async (movieId) => {

};

// Update product listing
export const updateProduct = async (
    productId,
    category,
    vendor,
    name,
    description,
    pricing,
    photos,
    condition,
    status
) => {
  
};

// export const renameProduct = async (id, newName) => {
 
// };