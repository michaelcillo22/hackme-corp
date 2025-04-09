//import express and express router as shown in lecture code and worked in previous labs.  Import your data functions from /data/movies.js that you will call in your routes below
import express from "express";
const router = express.Router();

import {productInfo} from "../data/index.js";
import helpers from "../helpers/helpers_CD.js";

router.route('/').get(async (req, res) => {
  //code here for GET will render the home handlebars file

  try {

    // Get our available products
    let productsList = await productInfo.getAllProducts();

    // Render to home.handlebars
    res.render("productHome", {
      title: "Available Products",
      productDescription: "Search our available products today!",
      searchInputId: "searchProductsByName",
      products: productsList
    })

  } catch (e) {

    // Return 404 for other URLs
    console.log(e.toString());
    return res.status(404).json({errorMsg: e.toString()});
  }
});

router.route('/searchproducts').post(async (req, res) => {
  //code here for POST this is where your form will be submitting searchMoviesByName and then call your data function passing in the searchMoviesByName and then rendering the search results of up to 20 Movies.

  let productData;
  try {

    // Get product data
    productData = req.body;

    // Ensure there is something present in the req.body as shown in lecture 6
    if (!productData || Object.keys(productData).length === 0) {
      throw {code: "NO_BODY", message: "No product was entered in the search bar."};
    }
  } catch (e) {
    return res.status(400).render("productError", {errorMsg: "No product was entered in the search bar."});
  }

  let productSearchTerm;
  try {

    // Call searchProductByName
    productSearchTerm = productData.searchProductsByName;

    // Make appropriate validations using checkString
    productSearchTerm = helpers.checkString(productSearchTerm, "Product Search Term");
  } catch (e) {
    return res.status(400).render("productError", {errorMsg: e.toString()});
  }

  let productResults;
  try {
    
    // Now call searchProductByName method from products.js
    productResults = await productInfo.searchProductByName(productSearchTerm);

    // Check if no matches were found, then render error
    if (!productResults || productResults.length === 0) {
      throw {code: "NO_RESULTS", message: `We're sorry, but no results were found for ${productSearchTerm}`};
    }
  } catch (e) {

    // Throw 404 if no results found
    if (e.code === "NO_RESULTS") {
      return res.status(404).render("productError", {
        errorMsg: `We're sorry, but no results were found for ${productSearchTerm}`
      });
    } else {
      return res.status(400).render("productError", { errorMsg: e.toString() });
    }
  }

  try {

    // When successful, render to productSearchResults.handlebar
    return res.status(200).render("productSearchResults", {
      title: "Products Found", 
      header: "Products Found",      
      productSearchTerm: productSearchTerm,     
      productResultList: productResults        
    });

  } catch (e) {
    
    // If no input was put or just empty spaces, throw error
    console.log(e.toString());
    return res.status(400).render("productError", {errorMsg: e.toString()});
  }
});

// Create our product route
router
    .route('/createproduct')

    // Show our create product page handlebar
    .get(async (req, res) => {
        try {
            res.render("createProduct", { title: "List a New Product" });
        } catch (e) {
            return res.status(400).render("productError", { errorMsg: e.toString() });
        }
    })
    .post(async (req, res) => {
        try {

        // Declare the variables we will be adding as input
        const {
            category,
            vendor,
            name,
            description,
            price,
            photos,
            condition,
            status
        } = req.body;

        // Call our createProduct method to create method in DB
        const createNewProduct = await productInfo.createProduct(
            category,
            vendor,
            name,
            description,
            parseFloat(price),                          // Ensure price is a number, not string
            Array.isArray(photos) ? photos : [photos],  // Convert photos to an array if needed.
            condition,
            status
        );
        
        // Ensure to send new product to JSON, status 201 meaning a new resource, aka product, was successfully created
        res.status(201).json(createNewProduct);
        } catch (e) {
            return res.status(400).json({ error: e.toString() });
        }
    });

router.route('/:id').get(async (req, res) => {
    // code here for GET a single product
    // try catch for checking product data first
    let productData;
    try {
        
        // Check id first
        productData = helpers.checkId(req.params.id, "Product ID");
    
    } catch (e) {
        return res.status(400).render("productError", {errorMsg: "There are no fields in the request body."});
    }
    
    // Check the movie results
    let productResults;
    try {
    
        // Now call searchMovieById method from movies.js
        productResults = await productInfo.searchProductById(productData);
    
        // Check if matches were found, then render
        if (!productResults || productResults.Response === "False" || !productResults.name || productResults.name === "N/A") {
        return res.status(404).render("productError", {
            errorMsg: `We're sorry, but no results were found for ${productData}`
        })
        }
    
    } catch (e) {
    
        // Use our custom code from axios
        if (e.code === "PRODUCT_NOT_FOUND") {
        return res.status(404).render("productError", {
            errorMsg: `We're sorry, but no results were found for ${productData}`
        })
        }
        // If no input was put or just empty spaces, throw error
        return res.status(400).render("productError", {errorMsg: e.toString()});
    }
    
    // When successful, render to movieSearchResults.handlebar
    return res.status(200).render("productById", {
        category: productResults.category,  
        vendor: productResults.vendor,      
        name: productResults.name,       
        description: productResults.description,
        price: productResults.price,
        photos: productResults.photos,
        condition: productResults.condition,  
        status: productResults.status,    
        // reviews: productResults.reviewsArray,
        overallRating: productResults.overallRatingValue,
        productListedDate: productResults.productListedDate 
    });
});

//export router
export default router;