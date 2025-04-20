// Export the following functions using ES6 Syntax
import helpers from "../helpers/helpers_CD.js";
import {products} from "../config/mongoCollections.js";
import {ObjectId} from "mongodb";

// Create a review
export const createReview = async (
  productId,          // Object ID
  verified_purchase,  // Boolean
  reviewer_name,      // String
  reviewer_account,   // Object ID
  review_title,       // String
  review_score,       // Number
  review_body,        // String
) => {
  
  // Validation checks
  productId = helpers.checkId(productId, "Product ID");
  reviewer_account = helpers.checkId(reviewer_account, "Reviewer Account ID");
  reviewer_name = helpers.checkString(reviewer_name, "Reviewer Name");
  review_title = helpers.checkString(review_title, "Review Title");
  review_body = helpers.checkString(review_body, "Review Body");

  // Other checks if input is provided
  if (!verified_purchase || !review_score) {
    throw "Oh no! Reviewer verification or score was not provided :(";
  }

  // Check if verified_purchase is type boolean
  if (typeof verified_purchase !== "boolean") {
    throw "Oh no! Verified_purchase must be a boolean :(";
  }

  // Check if score is pos and valid
  if (review_score < 0 || isNaN(review_score) || typeof review_score !== "number") {
    throw "Oh no! The review score must be a positive number :(";
  }

  // Check if score is not a number from 1 to 5 and if one decimal place is used
  if (review_score < 1 || review_score > 5) {
    throw "Oh no! The rating must be a number from 1 to 5";
  }

  // Round the rating to one decimal place as mentioned
  review_score = Number(review_score.toFixed(1));

  // Set current date of when review is posted
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

  let reviewDate = `${monthNow}/${dayNow}/${yearNow}`;
  reviewDate = reviewDate.toString();

  // Establish connection to product
  const productCollection = await products();

  // Find the matching product ID for the review
  const currentProduct = await productCollection.findOne({_id: new ObjectId(productId)});

  // Check if the product exists
  if (!currentProduct) {
    throw "Oh no! There is no product with the ID mentioned :(";
  }

  // Initialize our comments array to be empty and helpfulness_votes to be 0
  let commentsArray = [];
  let helpfulnessVotes = 0;

  // Now let's construct the DB structure for review
  let newReview = {
    _id: new ObjectId(),
    verified_purchase: verified_purchase,
    reviewer_name: reviewer_name,     
    reviewer_account: reviewer_account,  
    review_title: review_title,
    review_date: reviewDate,
    review_score: review_score,       
    review_body: review_body,       
    comments: commentsArray,
    helpfulness: helpfulnessVotes
  }

  // Perform our update method
  const productUpdatedReview = await productCollection.findOneAndUpdate(
    {_id: new ObjectId(productId)},
    {$push: {reviews: newReview}},
    {returnDocument: "after"}
  );

  // Check if the product does not exist
  if (!productUpdatedReview) {
    throw "Oh no! The product does not exist, hence cannot be updated :(";
  }

  // Obtain the updated product after the review was deleted
  let productUpdated = productUpdatedReview;

  // Initialize our review array
  let reviewsArray = productUpdated.reviews;
  let overallRatingValue = 0;

  // Perform recalculations, ensure not to divide by 0
  if (reviewsArray.length > 0) {
    let sumRating = 0;
    for (let reviewTracker of reviewsArray) {
      sumRating += reviewTracker.review_score;
    }

    let averageReview = sumRating / reviewsArray.length;

    // Ensure the rating is rounded to 1 decimal place
    overallRatingValue = Number((averageReview).toFixed(1));
  }

  // Now update the product with the new overall rating value
  const newProductUpdate = await productCollection.findOneAndUpdate(
    {_id: productUpdated._id},
    {$set: {overallRating: overallRatingValue}},
    {returnDocument: "after" }
  );

  // Check if the product cannot be updated
  if (!newProductUpdate) {
    throw "Oh no! The product could not be updated with the new review :(";
  }

  // Return product object that the review belonged to show that the review sub-document was removed from the product document
  return newProductUpdate;
};

// Populate all reviews for the product
export const getAllReviews = async (productId) => {

  // Validate productId
  productId = helpers.checkId(productId, "Product ID");

  // Initialize our product collection
  const productCollection = await products();

  // Ensure to convert string to ObjectID form for MongoDB
  const currentProduct = await productCollection.findOne(
    {_id: new ObjectId(productId)}
  );

  // Check if no product exists with that id
  if (!currentProduct) {
    throw "Oh no! There is no product with the ID mentioned :(";
  }

  // Intiialzie our review array list of that particular product
  let ourReviewList = currentProduct.reviews;

  // Check if review array is empty, we should return empty
  if (ourReviewList.length === 0) {
    return [];
  }

  // Use map as utilized in lecture 4
  ourReviewList = ourReviewList.map((reviewElement) => {
    reviewElement._id = reviewElement._id.toString();
    return reviewElement;
  });

  return ourReviewList;
};

// Get Review
export const getReview = async (reviewId) => {

  // Validate id
  reviewId = helpers.checkId(reviewId, "Review ID");

  // Get our product collection ready
  const productCollection = await products();

  // Ensure to convert string to ObjectID form for MongoDB
  const currentProduct = await productCollection.findOne({
    "reviews._id": new ObjectId(reviewId)}
  );

  // Check if no product exists with that id
  if (!currentProduct) {
    throw "Oh no! There is no product with the ID mentioned :(";
  }

  // Find specific review and check if it exists
  let currentReview = currentProduct.reviews.find((reviewSlot) => 
    reviewSlot._id.toString() === reviewId);

  if (!currentReview) {
    throw "Oh no! There is no review with the ID mentioned :(";
  }
  currentReview._id = currentReview._id.toString();
  return currentReview;
};

// // Remove review from inventory
// export const removeReview = async (reviewId) => {
  
//   // Validate id
//   reviewId = helpers.checkId(reviewId, "Review ID");

//   // Get our product collection ready
//   const productCollection = await products();

//   // Initialize our product deletion info and remove review
//   const reviewDeletionInfo = await productCollection.findOneAndUpdate(
//     {"reviews._id": new ObjectId(reviewId)},
//     {$pull: {reviews: {_id: new ObjectId(reviewId)}}},
//     {returnDocument: "after" }
//   );

//   // Check if the review cannot be removed (does not exist)
//   if (!reviewDeletionInfo) {
//     throw `Oh no! The review with id of ${reviewId} does not exist, so it cannot be deleted :(`;
//   }

//   // Obtain the updated product document after the review was deleted
//   let productUpdated = reviewDeletionInfo;

//   // Initialize our review array
//   let reviewsArray = productUpdated.reviews;
//   let overallRatingValue = 0;

//   // Perform recalculations, ensure not to divide by 0
//   if (reviewsArray.length > 0) {
//     let sumRating = 0;
//     for (let reviewTracker of reviewsArray) {
//       sumRating += reviewTracker.review_score;
//     }

//     let averageReview = sumRating / reviewsArray.length;

//     // Ensure the rating is rounded to 1 decimal place
//     overallRatingValue = Number((averageReview).toFixed(1));
//   }

//   // Now update the product with the new overall rating value
//   const newProductUpdate = await productCollection.findOneAndUpdate(
//     {_id: productUpdated._id},
//     {$set: {overallRating: overallRatingValue}},
//     {returnDocument: "after" }
//   );

//   // Check if the product cannot be updated
//   if (!newProductUpdate) {
//     throw `Oh no! The product with review id of ${reviewId} does not exist, so it cannot be deleted :(`;
//   }

//   // Return product object that the review belonged to show that the review sub-document was removed from the product document
//   return newProductUpdate;
// };