const Listing = require("../models/listing");
const axios = require("axios");

module.exports.index = async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index.ejs", { allListings });
};


module.exports.renderNewForm = async(req, res) => {
  res.render("listings/new.ejs");
};

module.exports.showListing =  async (req, res, next) => {
  let { id } = req.params;
  const listing = await Listing.findById(id)
  .populate({
    path: "reviews",
    populate: {
      path: "author",
    }
  })
  .populate("owner");
  if (!listing) {
    req.flash("error", "Cannot find that listing");
    return res.redirect("/listings");
  }
  console.log(listing);
  res.render("listings/show.ejs", { listing, currUser: req.user });
};

module.exports.createListing = async (req, res) => {
    const response = await axios.get("https://api.opencagedata.com/geocode/v1/json", {
        params: {
            q: req.body.listing.location,
            key: process.env.OPENCAGE_KEY,
            limit: 1
        }
    });

    const geoData = response.data.results[0].geometry;

    let url = req.file.path;
    let filename = req.file.filename;
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = { url, filename };

    newListing.geometry = {
        type: "Point",
        coordinates: [geoData.lng, geoData.lat]
    };

    await newListing.save();

    req.flash("success", "Successfully created a listing!");
    res.redirect("/listings");
};


module.exports.renderEditForm = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Cannot find that listing");
    return res.redirect("/listings");
  }

  let orignalImageUrl = listing.image.url
  orignalImageUrl = orignalImageUrl.replace("/upload", "/upload/w_250");
  res.render("listings/edit.ejs", { listing, orignalImageUrl});
};

module.exports.updateListing = async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });

  if (typeof req.file !== 'undefined') {
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = {  url,  filename };
    await listing.save();
  }
  req.flash("success", "Successfully updated a listing");
  res.redirect(`/listings/${id}`);
};

module.exports.destroyListing = async (req, res) => {
  let { id } = req.params;
  let deletedListing = await Listing.findByIdAndDelete(id);
  console.log(deletedListing);
  req.flash("success", "Successfully deleted a listing");
  res.redirect("/listings");
};