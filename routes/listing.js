const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
//const { listingSchema } = require("../schema");
//const ExpressError = require("../utils/ExpressError");
const Listing = require("../models/listing");
//const Review = require("../models/review");
const {isLoggedIn , isOwner , validateListing} = require("../middlewares.js");

const listingController = require("../controllers/listings");
const multer = require('multer');
const {storage} = require("../cloudConfig");
const upload = multer({storage});

const validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    throw new ExpressError(error.details.map(el => el.message).join(","), 400);
  } else {
    next();
  }
};

router.route("/")
  .get(wrapAsync(listingController.index))
  .post(
    isLoggedIn,
    //validateListing,
    upload.single("listing[image]"),
    wrapAsync(listingController.createListing)
  );

//New Route
router.get("/new", isLoggedIn , listingController.renderNewForm );

router.route("/:id")
    .get( wrapAsync(listingController.showListing))              //Show route
    .put(isLoggedIn , isOwner ,                                   //  Update route
        wrapAsync (listingController.updateListing))    
    .delete(                                                       //Delete Route
    isLoggedIn,
    isOwner ,
    listingController.destroyListing
);



//Edit route
router.get("/:id/edit" ,
    isLoggedIn ,
    isOwner ,
    wrapAsync(listingController.renderEditForm )
);

module.exports = router;