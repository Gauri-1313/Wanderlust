const Listing = require("../models/listing");

module.exports.index = async (req , res) =>{
    const allListings = await Listing.find({});
        res.render("listings/index" , {allListings});
};

module.exports.renderNewForm =(req , res)=>{
    res.render("listings/new");
};

module.exports.showListing = async (req , res) => {
    let {id} =req.params;
    const listing = await Listing.findById(id)
    .populate("owner")
    .populate({
        path : "reviews" ,
        populate: {
            path: "author",
        },
    });
    if(!listing){
        req.flash("success" , "Listing you requested for does not exists");
        res.redirect("/listings");
    }
    console.log(listing);
    res.render("listings/show", {listing});
    };

    module.exports.createListing =async (req, res) => {
        let url = req.file.path;
        let filename = req.file.filename;
        console.log(url , ".." , filename);
        console.log("RAW BODY ", req.body);
        console.log("LISTING ", req.body.listing);
        const newListing = new Listing(req.body.listing);
        //console.log(req.user);
        // if(req.file){
        // newListing.image = {
        // url: req.file.path,
        // filename: req.file.filename
        // };
        newListing.owner = req.user._id;
        newListing.image = (url , filename);
        await newListing.save();
        req.flash("success" , "New Listing Created!");
        res.redirect("/listings");
    };

    module.exports.renderEditForm = async (req , res)=>{
        let {id} = req.params;
        const listing = await Listing.findById(id);
        if(!listing){
            req.flash("success" , "Listing you requested for does not exists");
            res.redirect("/listings");
        }
        res.render("listings/edit" , {listing});
    };

    module.exports.updateListing = async (req , res)=>{  
        let {id} =req.params;
            await Listing.findByIdAndUpdate(id ,{...req.body.listing});
            req.flash("success" , "Listing Updated!");
            res.redirect(`/listings/${id}`);
        };

module.exports .destroyListing = async (req , res)=>{
    let {id} =req.params;
    let deleteListing = await Listing.findByIdAndDelete(id);
    console.log(deleteListing);
    req.flash("success" , " Listing Deleted!");
    res.redirect("/listings");
};