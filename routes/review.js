const express = require("express");
const router = express.Router({mergeParams: true});
const wrapAsync = require("../utils/wrapAsync");
const ExpressError = require("../utils/ExpressError");
const { reviewSchema } = require("../schema");
//const Review = require("../models/review");
const Listing = require("../models/listing");
const {validateReview} = require("../middleware");
const { isLoggedIn,  isReviewAuthor } = require("../middlewares");

const reviewController = require("../controllers/reviews");
const review = require("../models/review");


//Post Review Route
router.post("/" , 
  isLoggedIn,
  validateReview,
  wrapAsync(reviewController.createReview)
);

//Delete Review Route
router.delete("/:reviewId" , 
  isLoggedIn,
  isReviewAuthor,
    wrapAsync ( reviewController.destroyReview)
);

module.exports = router;