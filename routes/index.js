var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
    var db = req.db;
    var collection = db.get('mapcollection');
    collection.find({},{},function(e,docs){
        res.render('map', {
            title : "CCN Map",
            poi : docs
        });
    });
});

/* GET remove page. */
router.get('/edit', function(req, res) {
    var db = req.db;
    var collection = db.get('mapcollection');
    collection.find({},{},function(e,docs){
        res.render('edit', {
            "poi_list" : docs
        });
    });
});

/* POST from /edit form add */
router.post('/add', function(req, res) {
    // Set our internal DB variable
    var db = req.db;

    // Get our form values. These rely on the "name" attributes
    var new_name = req.body.name;
    var new_website = req.body.website;
    var new_email = req.body.email;
    var new_lat = req.body.lat;
    var new_lng = req.body.lng;

    // Set our collection
    var collection = db.get('mapcollection');

    // Submit to the DB
    collection.insert({
        "name" : new_name,
        "website" : new_website,
        "email" : new_email,
        "lat" : new_lat,
        "lng" : new_lng
    }, function (err, doc) {
        if (err) {
            // If it failed, return error
            res.send("There was a problem adding the information to the database.");
        }
        else {
            // Else return to original page
            res.redirect("/edit");
        }
    });
});

/* POST from /edit form remove */
router.post('/remove', function(req, res) {
    // Set our internal DB variable
    var db = req.db;

    // Get our form values. These rely on the "name attributes
    var remove_name = req.body.remove;

    // Set our collection
    var collection = db.get('mapcollection');

    // Submit to the DB
    collection.remove({
        "name" : remove_name
    }, function (err, doc) {
        if (err) {
            // If it failed, return error
            res.send("There was a problem removing from the database.");
        }
        else {
            // Else return to original page
            res.redirect("/edit");
        }
    });
});

module.exports = router;
