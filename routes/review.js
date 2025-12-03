const express = require("express");
const router = express.Router({mergeParams: true});
const Review = require("../models/review"); 
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const review = require("../models/review.js");
const Listing = require("../models/listing.js");
const { validateReview, isLoggedIn, issReviewAuthor } = require("../middleware.js");

const reviewController = require("../controllers/reviews.js");

// post route
router.post("/", isLoggedIn, validateReview, wrapAsync(reviewController.createReview));


// delete route for review
router.delete("/:reviewId",isLoggedIn, issReviewAuthor, wrapAsync(reviewController.destoryReview));

module.exports = router;