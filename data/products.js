// Export the following functions using ES6 Syntax
import helpers from "../helpers/helpers_CD.js";
import {products} from "../config/mongoCollections.js";
import {categories} from "../config/mongoCollections.js";
import {ObjectId} from "mongodb";

// Listing a product
export const createProduct = async (
export const createProduct = async (
  category,     // String
  vendor,       // String
  name,         // Allow string and num
  description,  // String
  price,        // Must be a positive num
  photos,       // An array
  condition,    // String
  stock,        // Must be a positive num
) => {
  
  // Validation checks
  category = helpers.checkString(category, "Category");
  vendor = helpers.checkString(vendor, "Vendor");
  description = helpers.checkString(description, "Description");
  condition = helpers.checkString(condition, "Condition");
  photos = helpers.checkStringArray(photos, "Photo URL");
  photos = helpers.checkValidURL(photos, "Photo URL");

  // Other checks if input is provided
  if ( !name || !price || !photos) {
    throw "Oh no! The name, price, and/or photo URL is not provided :(";
  }

  // Check if photos is an array and there is at least one photo
  if (!Array.isArray(photos)) {
    throw "Oh no! Photos is not an array :(";
  }

  if (photos.length < 1) {
    throw "Oh no! Photos must have at least one URL :(";
  }

  // Check for valid category, condition, and status values
  // Obtain categories' names dynamically from categories collection
  let categoryCollection = await categories();
  let categoryArray = await categoryCollection.find({}).toArray();

  // Utilize a map to obtain names of categories
  let validCategories = categoryArray.map(currentCategory =>
    currentCategory.categoryName
  );

  let validConditions = ["New", "Used"];

 // if (!validCategories.includes(category)) {
  //  throw "Oh no! The category must be valid :(";
 // };
  
  if (!validConditions.includes(condition)) {
    throw "Oh no! The condition must be valid :(";
  };

  if (!validStatus.includes(status)) {
    throw "Oh no! The status must be valid :(";
  };
  
  // Check if price is pos and valid
  if (price < 0 || isNaN(price) || typeof price !== "number") {
    throw "Oh no! Price must be a positive number :(";
  }

  // Check if stock is a pos integer num and valid
  if (stock < 0 || !Number.isInteger(stock) || typeof stock !== "number") {
    throw "Oh no! Stock must be a positive number :(";
  }

  // Determine status based on stock
  let status = null;
  if (stock === 0) {
    status = "Out of stock";
  } else {
    status = "In stock";
  }

  // Set current date of when product is posted
  let dateNow = new Date();
  let monthNow = dateNow.getMonth() + 1;
  let dayNow = dateNow.getDate();
  let yearNow = dateNow.getFullYear();

  // Set format correctly
  if (monthNow < 10) {
    monthNow = "0" + monthNow;
  }

  if (dayNow < 10) {
    dayNow = "0" + dayNow;
  }

  let productListedDate = `${monthNow}/${dayNow}/${yearNow}`;
  productListedDate = productListedDate.toString();

  // Initialize our reviews array to be empty and Overall Rating to be 0
  let reviewsArray = [];
  let overallRatingValue = 0;

  // Define our new product
  let newProduct = {
    category: category,  
    vendor: vendor,      
    name: name,       
    description: description,
    price: price,
    photos: photos,
    condition: condition,  
    status: status,    
    stock: stock,
    reviews: reviewsArray,
    overallRating: overallRatingValue,
    productListedDate: productListedDate  
  };

  // Establish connection
  const productCollection = await products();

  // Execute the query
  const insertProductInfo = await productCollection.insertOne(newProduct);

  // Check if the insert was successful
  if (!insertProductInfo.acknowledged || !insertProductInfo.insertedId)
    throw "Oh no! Product could not be added";

  // Return the result
  const newProductID = insertProductInfo.insertedId.toString();

  const theProduct = await getProductById(newProductID);
  return theProduct;
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
export const getProductById = async (productId) => {

  // Validate id
  productId = helpers.checkId(productId);

  // Get our product collection ready
  const productCollection = await products();

  // Ensure to convert string to ObjectID form for MongoDB
  const currentProduct = await productCollection.findOne({_id: new ObjectId(productId)});

  // Check if no product exists with that id
  if (!currentProduct) {
    throw "Oh no! There is no product with the ID mentioned :(";
  }

  currentProduct._id = currentProduct._id.toString();
  return currentProduct;
};

// Remove product from inventory
export const removeProduct = async (productId) => {
  
  // Validate id
  productId = helpers.checkId(productId);

  // Get our product collection ready
  const productCollection = await products();

  // Initialize our product product info
  const productDeletionInfo = await productCollection.findOneAndDelete({
    _id: new ObjectId(productId)
  });

  // Check if the product cannot be removed (does not exist)
  if (!productDeletionInfo) {
    throw `Oh no! The product with id of ${productId} does not exist, so it cannot be deleted :(`;
  }

  // Return exactly as formatted
  return `${productDeletionInfo.name} has been successfully deleted!`;
};

// TO DO: Update product listing
export const updateProduct = async (
  productId,
  category,
  vendor,
  name,
  description,
  price,
  photos,
  condition,
  stock
) => {

  // Validation checks
  productId = helpers.checkId(productId, "Product ID:");
  category = helpers.checkString(category, "Category");
  vendor = helpers.checkString(vendor, "Vendor");
  description = helpers.checkString(description, "Description");
  condition = helpers.checkString(condition, "Condition");
  photos = helpers.checkStringArray(photos, "Photo URL");
  photos = helpers.checkValidURL(photos, "Photo URL")

  // Other checks if input is provided
  if ( !name || !price || !photos) {
    throw "Oh no! The name, price, and/or photo UR is not provided :(";
  }

  // Check if photos is an array and there is at least one photo
  if (!Array.isArray(photos)) {
    throw "Oh no! Photos is not an array :(";
  }

  if (photos.length < 1) {
    throw "Oh no! Photos must have at least one URL :(";
  }

  // Check for valid category, condition, and status values
  // Obtain categories' names dynamically from categories collection
  let categoryCollection = await categories();
  let categoryArray = await categoryCollection.find({}).toArray();

  // Utilize a map to obtain names of categories
  let validCategories = categoryArray.map(currentCategory =>
    currentCategory.categoryName
  );

  let validConditions = ["New", "Used"];

  if (!validCategories.includes(category)) {
    throw "Oh no! The category must be valid :(";
  };

  if (!validConditions.includes(condition)) {
    throw "Oh no! The condition must be valid :(";
  };

  // Check if price is pos and valid
  if (price < 0 || isNaN(price) || typeof price !== "number") {
    throw "Oh no! Price must be a positive number :(";
  }

  // Check if stock is a pos integer num and valid
  if (stock < 0 || !Number.isInteger(stock) || typeof stock !== "number") {
    throw "Oh no! Stock must be a positive number :(";
  }

  // Determine status based on stock
  let status = null;
  if (stock === 0) {
    status = "Out of stock";
  } else {
    status = "In stock";
  }

  // Set current date of when product is posted
  let dateNow = new Date();
  let monthNow = dateNow.getMonth() + 1;
  let dayNow = dateNow.getDate();
  let yearNow = dateNow.getFullYear();

  // Set format correctly
  if (monthNow < 10) {
    monthNow = "0" + monthNow;
  }

  if (dayNow < 10) {
    dayNow = "0" + dayNow;
  }

  let productListedDate = `${monthNow}/${dayNow}/${yearNow}`;
  productListedDate = productListedDate.toString();

  // Let's update our product data
  let updatedProduct = {
    category: category,
    vendor: vendor,
    name: name,
    description: description,
    price: price,
    photos: photos,
    condition: condition,
    status: status,
    stock: stock
  }

  const theProductId = new ObjectId(productId);
  const productCollection = await products();

  // Figure out which product has this id
  const currentProduct = await productCollection.findOne({ _id: theProductId });
  
  // Check if the product exists in the first place
  if (!currentProduct) {
    throw `Oh no! The current product with id: ${productId} is not found :(`;
  }

  // Perform our update method as utilized in lecture 4
  const productUpdatedInfo = await productCollection.findOneAndUpdate(
    {_id: theProductId},
    {$set: updatedProduct},
    {returnDocument: "after"}
  );

  // Check if the product does not exist
  if (!productUpdatedInfo) {
    throw "Oh no! The product does not exist, hence cannot be updated :(";
  }

  productUpdatedInfo._id = productUpdatedInfo._id.toString();
  return productUpdatedInfo;
};

export const searchProductByName = async (name) => {

  // Let's do our basic validations, where it will be trimmed too
  name = helpers.checkString(name, "Product Name");

  try {

    // Get our product collection
    const productCollection = await products();

    // Get our array of products based on search using regex for case-insensitive
    let productResults = await productCollection.find({
      name: {$regex: name, $options: "i"}
    }).toArray();

    let productResultsTotal = productResults.length;

    // Throw error if no products were found
    if (!productResults || productResults.length === 0) {
      let productError = new Error(`Oh no! No products were found matching '${name}'`);
      productError.code = "NO_RESULTS";
      throw productError;
    }

    return productResults;
  } catch (e) {
    if (e.code === 'ENOTFOUND') {
        throw 'Error: Invalid URL';
    }
    else if (e.response) {
        throw `Error: ${e.response.status}: ${e.response.statusText}`;
    }
    else {
        throw e;
    }
  }
};

export const searchProductById = async (id) => {
  
  // Let's do our basic validations, where it will be trimmed too
  id = helpers.checkId(id, "Product ID");

  try {

    // Call our getProductById
    let currentProduct = getProductById(id);

    // Throw error if no products were found
    if (!currentProduct) {
      let productError = new Error(`Oh no! No product was found with ID '${id}'`);
      productError.code = "PRODUCT_NOT_FOUND";
      throw productError;
    }

    // Return our movie result
    return currentProduct;

  } catch (e) {
    if (e.code === 'ENOTFOUND') {
        throw 'Error: Invalid URL';
    }
    else if (e.response) {
        throw `Error: ${e.response.status}: ${e.response.statusText}`;
    }
    else {
        throw e;
    }
  }
};