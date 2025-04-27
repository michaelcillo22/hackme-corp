//import express and express router as shown in lecture code and worked in previous labs.  Import your data functions from /data/movies.js that you will call in your routes below
import express from "express";
const router = express.Router();

import {productInfo} from "../data/index.js";
import helpers from "../helpers/helpers_CD.js";
import categories from "../data/categories.js";
import xss from "xss";

router.route('/').get(async (req, res) => {
  //code here for GET will render the home handlebars file

  try {

    // Get our available products
    let productsList = await productInfo.getAllProducts();

    // Get logged-in user info and id, and check if they are a vendor or buyer
    const userLoggedIn = req.isAuthenticated;
    let userVendor = req.session.userType === 'seller';
    let currentUserId = req.session.userId

    // Render to home.handlebars
    res.render("productHome", {
      title: "Available Products",
      productDescription: "Search our available products today!",
      searchInputId: "searchProductsByName",
      user: userLoggedIn,
      userVendor: userVendor,
      currentUserId: currentUserId,
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
    productSearchTerm = xss(helpers.checkString(productSearchTerm, "Product Search Term"));
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

    // Get logged-in user info and id
    let currentUserId = req.session.userId

    // When successful, render to productSearchResults.handlebar
    return res.status(200).render("productSearchResults", {
      title: "Products Found", 
      header: "Products Found",      
      productSearchTerm: productSearchTerm,     
      productResultList: productResults,
      currentUserId: currentUserId     
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
        
        // Ensure ensure user is auth and logged in and user is type seller
        if (!req.isAuthenticated || req.session.userType !== "seller") {
          return res.redirect("/auth/login");
        }

        // Obtain both parent and child categories dynamically
        let getAllCategories = await categories.getAllCategories();

        return res.render("createProduct", {
          title: "List a New Product",
          categories: getAllCategories,
        });
      } catch (e) {
        return res.status(400).render("productError", { errorMsg: e.toString() });
      }
    })

    .post(async (req, res) => {
      console.log("raw req.body.category:", req.body.category);
      try {
        
        // Ensure ensure user is auth and logged in
        if (!req.isAuthenticated) {
          return res.redirect("/auth/login");
        }

        // Declare the variables we will be adding as input
        let {
            category,
            name,
            description,
            price,
            photos,
            condition,
            status,
            stock
        } = req.body;

        // Vendor is the name of user logged in
        let vendor = req.session.userName;

        // Keep track of selected category Id
        if (!Array.isArray(category)) {
          category = [category];
        }

        let selectedCatId = category[category.length - 1];

        // Check if the deepest category is picked up
        console.log("Deepest Category ID:", selectedCatId);

        if (!selectedCatId) {
          throw "You must select at least one category";
        }

        // Get category Id name
        let categoryObj = await categories.getCategoryById(selectedCatId);
        let categoryName = categoryObj.categoryName;

        name = xss(name);
        description = xss(description);
        condition = xss(condition);
        status = xss(status);

        // Check as number
        price = Number(xss(price.toString()));
        stock = Number(xss(stock.toString()));

        // TO DO: Switch to photo upload using Multer or ensure to sanitize each URL in photos

        // Call our createProduct method to create method in DB
        let createNewProduct = await productInfo.createProduct(
            categoryName,
            vendor,
            name,
            description,
            price,                                      // Ensure price is a number, not string
            Array.isArray(photos) ? photos : [photos],  // Convert photos to an array if needed.
            condition,
            stock
        );
        
        // Ensure to send new product to JSON, status 201 meaning a new resource, aka product, was successfully created
        res.status(201).json(createNewProduct);
      } catch (e) {
          return res.status(400).json({ error: e.toString() });
      }
    });

router.route('/:id')
  .get(async (req, res) => {
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

    // Get logged-in user info like id, type, and name. Ensure the user logged in is a seller and the one who listed the product
    let currentUserId = req.session.userId;
    let productCollection = await productInfo.getProductById(productResults._id);
    let currentUserIsProductLister = 
      req.isAuthenticated
      && req.session.userType === 'seller'
      && productCollection.vendor === req.session.userName;

    // When successful, render to productSearchResults.handlebar
    return res.status(200).render("productById", {
        _id: productResults._id,
        category: productResults.category,  
        vendor: productResults.vendor,      
        name: productResults.name,       
        description: productResults.description,
        price: productResults.price,
        photos: productResults.photos,
        condition: productResults.condition,  
        status: productResults.status,    
        stock: productResults.stock,
        reviews: productResults.reviews,
        overallRating: productResults.overallRating,
        productListedDate: productResults.productListedDate,
        currentUserId: currentUserId,
        currentUserIsProductLister: currentUserIsProductLister
    });
});

// Allows seller to edit their product listing
router
  .route('/:id/edit')
    .get(async (req, res) => {
      try {
        
        // Ensure ensure user is auth and a seller
        if (!req.isAuthenticated || req.session.userType !== "seller") {
          return res.redirect("/auth/login");
        }

        // Validate product id
        let productId = helpers.checkId(req.params.id, "Product ID");
      
        // Obtain product
        let getProduct = await productInfo.getProductById(productId);

        // Check to ensure that the seller is actually the one who listed the product
        let currentUserName = req.session.userName;
        if (getProduct.vendor !== currentUserName) {
          throw "Oh no! You are not the seller who listed this product :(";
        }

        // We need to load categories too
        let getAllCategories = await categories.getAllCategories();

        let selectedCategory = getAllCategories.map((cat) => ({
          _id: cat._id,
          categoryName: cat.categoryName,
          categorySelected: cat.categoryName === getProduct.category
        }));

        // let currentCondition = getProduct.condition === "New"
        return res.render("editProduct", {
          _id: getProduct._id,
          name: getProduct.name,
          description: getProduct.description,
          price: getProduct.price,
          photos: Array.isArray(getProduct.photos) ? getProduct.photos : [getProduct.photos],  // Convert photos to an array if needed.,  
          condition: getProduct.condition,
          stock: getProduct.stock,
          categories: selectedCategory
        });
      } catch (e) {
        return res.status(400).render("productError", { errorMsg: e.toString() });
      }
    })

    .post(async (req, res) => {
      try {
        
        // Ensure ensure user is auth and logged in
        if (!req.isAuthenticated || req.session.userType !== "seller") {
          return res.redirect("/auth/login");
        }

        // Validate product id
        let productId = helpers.checkId(req.params.id, "Product ID");
      
        // Obtain product
        let getProduct = await productInfo.getProductById(productId);

        // Check to ensure that the seller is actually the one who listed the product
        let currentUserName = req.session.userName;
        if (getProduct.vendor !== currentUserName) {
          throw "Oh no! You are not the seller who listed this product :(";
        }

        // Get our variables
        let {
          category,
          name,
          description,
          price,
          photos,
          condition,
          status,
          stock
        } = req.body;

        // // Ensure to sanitize and get category
        // let getCategory = await categories.getCategoryById(xss(categoryId));
        // let categoryName = getCategory.categoryName;

        // Keep track of selected category Id
        if (!Array.isArray(category)) {
          category = [category];
        }

        let selectedCatId = category[category.length - 1];

        // Check if the deepest category is picked up
        console.log("Deepest Category ID:", selectedCatId);

        if (!selectedCatId) {
          throw "You must select at least one category";
        }

        // Get category Id name
        let categoryObj = await categories.getCategoryById(selectedCatId);
        let categoryName = categoryObj.categoryName;

        name = xss(name);
        description = xss(description);
        condition = xss(condition);
        status = xss(status);

        // Check as number
        price = Number(xss(price.toString()));
        stock = Number(xss(stock.toString()));
    
        // Call updateProduct function
        let updatedProduct = await productInfo.updateProduct(
          productId,
          categoryName,
          getProduct.vendor,

          // Ensure to pass it through XSS
          name,
          description,
          price,
          Array.isArray(photos) ? photos : [photos],
          condition,
          stock
        );
    
        res.redirect(`/products/${productId}`);
      } catch (e) {
        return res.status(400).render("productError", { errorMsg: e.toString() });
      }
});

//export router
export default router;