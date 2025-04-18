//require express and express router as shown in lecture code
import express from "express";
const router = express.Router();

import {productInfo, reviewInfo, orderInfo} from "../data/index.js";
import helpers from "../helpers/helpers_CD.js";

router

    // Get all reviews displayed for the product
    .route('/:productId')
    .get(async (req, res) => {
        try {

            // First do our ID validations
            let productId = helpers.checkId(req.params.productId, "Product ID");
            let currentProduct = await productInfo.getProductById(productId);
        
            // Display reviews on product page
            return res.status(200).render("productById", {
                _id: productId,
                category: currentProduct.category,  
                vendor: currentProduct.vendor,      
                name: currentProduct.name,       
                description: currentProduct.description,
                price: currentProduct.price,
                photos: currentProduct.photos,
                condition: currentProduct.condition,  
                status: currentProduct.status,    
                reviews: currentProduct.reviews,
                overallRating: currentProduct.overallRating  
            });
        } catch (e) {
            
            // Return message that product cannot be found
            return res.status(404).render("productError", { errorMsg: e });
        }
    })

    .post(async (req, res) => {
        try {
            const reviewPostData = req.body;
    
            // Ensure there is something present in the req.body as shown in lecture 6
            if (!reviewPostData || Object.keys(reviewPostData).length === 0) {
                return res.status(400).render("productError", { errorMsg: "There are no fields in the req.body" });
            }
        
            // Check for productId from URL
            // First do our ID validations
            let productId = helpers.checkId(req.params.productId, "Product ID");
            if (!productId) {
                return res.status(400).render("productError", { errorMsg: "Product ID is required in the URL parameter" });
            }
    
            // Then we need to get logged-in user info
            const userLoggedIn = req.session.user;

            // Check if not logged in
            if (!userLoggedIn || !userLoggedIn._id) {
              throw "Oh no! You must be logged in to submit a review";
            }

            const reviewerAccount = userLoggedIn._id;

            // Check the orders made by user and see if they actually have purchased this product
            let userOrders = await orderInfo.getAllOrdersByUser(
                {userId: reviewerAccount},
                "buyer"
            );
            
            const reviewVerified = userOrders.some(order =>
                order.items.some(product => product.productId.toString() === productId)
            );

            // Check our validations and if the review inputs exist
            let reviewerName = helpers.checkString(userLoggedIn.userName, "Reviewer Name");
            let reviewTitle = helpers.checkString(reviewPostData.review_title, "Review Title");
            let reviewBody = helpers.checkString(reviewPostData.review_body, "Review Body");
            let reviewScore = Number(reviewPostData.review_score);
    
            // Other checks if input is provided
            if (!reviewScore) {
                throw "Oh no! Review score was not provided :(";
            }
    
            // Check if verified_purchase is type boolean
            if (typeof reviewVerified !== "boolean") {
                throw "Oh no! Verified_purchase must be a boolean :(";
            }
    
            // Check if score is pos and valid
            if (reviewScore < 0 || isNaN(reviewScore) || typeof reviewScore !== "number") {
                throw "Oh no! The review score must be a positive number :(";
            }
    
            // Check if score is not a number from 1 to 5 and if one decimal place is used
            if (reviewScore < 1 || reviewScore > 5) {
                throw "Oh no! The rating must be a number from 1 to 5";
            }
    
            // Round the rating to one decimal place as mentioned
            reviewScore = Number(reviewScore.toFixed(1));
            
            // Create review sub-doc
            await reviewInfo.createReview(
                productId,
                reviewVerified,
                reviewerName,
                reviewerAccount,
                reviewTitle, 
                reviewScore,
                reviewBody
            )
    
            // Obtain the updated product data with reviews
            const updatedProduct = await productInfo.getProductById(productId);
            
            // Success, display product with new review
            return res.status(200).render("productById", { 
                category: updatedProduct.category,  
                vendor: updatedProduct.vendor,      
                name: updatedProduct.name,       
                description: updatedProduct.description,
                price: updatedProduct.price,
                photos: updatedProduct.photos,
                condition: updatedProduct.condition,  
                status: updatedProduct.status,   
                reviews: updatedProduct.reviews,
                overallRating: updatedProduct.overallRating,
            });
        } catch (e) {
            return res.status(400).render("productError", { errorMsg: e });
        }
    })

    // // View details of one review
    // .route('/:reviewId')
    // .get(async (req, res) => {

    //     // First do our ID validations
    //     let productId = helpers.checkId(req.params.productId, "Product ID");
        
    //     try {
            
    //         // Use our getProductId() function to get product's ID
    //         const allReviews = await reviewInfo.getAllReviews(productId);
    //         if (!allReviews || allReviews.length === 0) {
    //             return res.status(400).render("productError", { errorMsg: "No reviews were found for this product." });
    //         }

    //         // Display reviews on product page
    //         return res.status(200).render("productById", {
    //             reviews: allReviews    
    //         });
    //     } catch (e) {
            
    //         // Return message that product cannot be found
    //         return res.status(404).render("productError", { errorMsg: "The product cannot be found." });
    //     }
    // })

    // // To view specific review
    // router
    // .route('/review/:reviewId')
    // .get(async (req, res) => {
    //     //code here for GET
    //     // First trim the movieId string
    //     const trimmedReviewId = req.params.reviewId.trim();

    //     // Validation for ObjectId
    //     if (!ObjectId.isValid(trimmedReviewId)) {
    //     return res.status(400).json({error: "Review ID is not a valid ObjectId!"});
    //     }

    //     try {

    //     // Use our getReview() function to get review of a specific movie
    //     const listedReview = await reviewInfo.getReview(trimmedReviewId);
    //     return res.status(200).json(listedReview);
    //     } catch (e) {
        
    //     // Return message that review cannot be found
    //     return res.status(404).json({error: "Review not Found!"});
    //     }
    // })
    // .delete(async (req, res) => {
    //     //code here for DELETE
    //     // First trim the movieId string
    //     const trimmedReviewId = req.params.reviewId.trim();

    //     // Validation for ObjectId
    //     if (!ObjectId.isValid(trimmedReviewId)) {
    //     return res.status(400).json({error: "Review ID is not a valid ObjectId!"});
    //     }

    //     // See if review exists
    //     let reviewExists = null;
    //     try {

    //     // Determine if the movie exists with :id provided
    //     reviewExists = await reviewInfo.getReview(trimmedReviewId);
    //     } catch (e) {
    //     console.log("The reviewId does not exist :(");
    //     return res.status(404).json({ error: "Review not found!" });
    //     }

    //     if (!reviewExists) {
    //     return res.status(404).json({ error: "Review not found!" });
    //     }

    //     try {

    //     // Remove review
    //     const removeReview = await reviewInfo.removeReview(trimmedReviewId);
    //     return res.status(200).json(removeReview);
    //     } catch (e) {
        
    //     // Return message that review cannot be found
    //     return res.status(404).json({error: "Review not Found!"});
    //     }
    // });

export default router;