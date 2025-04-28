//require express and express router as shown in lecture code
import express from "express";
const router = express.Router();

import {productInfo, reviewInfo, orderInfo} from "../data/index.js";
import helpers from "../helpers/helpers_CD.js";
import xss from "xss";

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
                stock: currentProduct.stock,  
                reviews: currentProduct.reviews,
                overallRating: currentProduct.overallRating, 
                user: req.session.user
            });
        } catch (e) {
            
            // Return message that product cannot be found
            return res.status(404).render("productError", { errorMsg: e });
        }
    })

    .post(async (req, res) => {
        try {

            // Ensure ensure user is auth and logged in
            if (!req.isAuthenticated) {
                return res.redirect("/auth/login");
            }

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
            const userLoggedIn = req.session.userId;
            const userName = req.session.userName;

            // Check if not logged in
            if (!userLoggedIn) {
              throw "Oh no! You must be logged in to submit a review";
            }

            // Check the orders made by user and see if they actually have purchased this product
            let userOrders = await orderInfo.getAllOrdersByUser(
                {userId: userLoggedIn},
                "buyer"
            );
            
            const reviewVerified = userOrders.some(order =>
                order.items.some(product => product.productId.toString() === productId)
            );

            // Check our validations and add XSS
            let reviewerName = xss(helpers.checkString(userName, "Reviewer Name"));
            let reviewTitle = xss(helpers.checkString(reviewPostData.review_title, "Review Title"));
            let reviewBody = xss(helpers.checkString(reviewPostData.review_body, "Review Body"));
            // let noXSSReviewScore = helpers.checkString(reviewPostData.review_score.toString(), "Review Score");
            let reviewScore = Number(xss(reviewPostData.review_score.toString()));
    
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
                userLoggedIn,
                reviewTitle, 
                reviewScore,
                reviewBody
            )
    
            // Obtain the updated product data with reviews
            const updatedProduct = await productInfo.getProductById(productId);
            
            // // Success, display product with new review
            // return res.status(200).render("productById", { 
            //     category: updatedProduct.category,  
            //     vendor: updatedProduct.vendor,      
            //     name: updatedProduct.name,       
            //     description: updatedProduct.description,
            //     price: updatedProduct.price,
            //     photos: updatedProduct.photos,
            //     condition: updatedProduct.condition,  
            //     status: updatedProduct.status,  
            //     stock: updatedProduct.stock, 
            //     reviews: updatedProduct.reviews,
            //     overallRating: updatedProduct.overallRating,
            // });

            // Success, display product with new review
            return res.redirect(`/products/${productId}`);
        } catch (e) {
            return res.status(400).render("productError", { errorMsg: e });
        }
    })

router

    // For our review likes
    .route('/:productId/:reviewId/like')
    .post(async (req, res) => {
        try {
        
            // First do our ID validations
            let productId = helpers.checkId(req.params.productId, "Product ID");
            let reviewId = helpers.checkId(req.params.reviewId, "Review ID");
            if (!productId) {
                return res.status(400).render("productError", { errorMsg: "Product ID is required in the URL parameter" });
            }

            if (!reviewId) {
                return res.status(400).render("productError", { errorMsg: "Review ID is required in the URL parameter" });
            }
    
            // Then we need to get logged-in user info
            const userLoggedIn = req.session.userId;

            // Check if not logged in
            if (!userLoggedIn) {
              throw "Oh no! You must be logged in to submit a comment";
            }

            // Call our like review function
            await reviewInfo.likeReview(reviewId, userLoggedIn);

            // Obtain the updated product data with reviews
            const updatedProduct = await productInfo.getProductById(productId);

            // Success, display product with new review
            return res.redirect(`/products/${productId}`);
        } catch (e) {
            return res.status(400).render("productError", { errorMsg: e });
        }
    });

router

    // For our comments subcollection
    .route('/:productId/:reviewId/comments')
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
            let reviewId = helpers.checkId(req.params.reviewId, "Review ID");
            let noXSSCommentBody = helpers.checkString(req.body.comment_body, "Comment Body");
            let commentBody = xss(noXSSCommentBody);

            if (!productId) {
                return res.status(400).render("productError", { errorMsg: "Product ID is required in the URL parameter" });
            }

            if (!reviewId) {
                return res.status(400).render("productError", { errorMsg: "Review ID is required in the URL parameter" });
            }

            if (!commentBody) {
                return res.status(400).render("productError", { errorMsg: "Comement is required :(" });
            }
    
            // Then we need to get logged-in user info
            const userLoggedIn = req.session.userId;
            const userName = req.session.userName;

            // Check if not logged in
            if (!userLoggedIn) {
              throw "Oh no! You must be logged in to submit a comment";
            }

            // Call our like review function
            await reviewInfo.createComment(reviewId, userLoggedIn, userName, commentBody);

            // Obtain the updated product data with reviews
            let updatedProduct = await productInfo.getProductById(productId);
            
            // Success, display product with new review
            return res.redirect(`/products/${productId}`);
        } catch (e) {
            return res.status(400).render("productError", { errorMsg: e });
        }
    });

export default router;