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

/* GET edit page. */
router.get('/edit', function(req, res) {
    var db = req.db;
    var collection = db.get('mapcollection');
    collection.find({},{},function(e,docs){
        res.render('edit', {
            'poi_list' : docs
        });
    });
});

/* POST from '/edit' form add */
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

/* POST from '/edit' form change */
router.post('/change', function(req, res) {
    // Set our internal DB variable
    var db = req.db;

    // Get our form values. These rely on the "name attributes
    var remove_id = req.body.remove;
    var edit_id = req.body.edit;

    // Set our collection
    var collection = db.get('mapcollection');

    // Submit to the DB if remove was requested
    if (remove_id) {
        collection.remove({
            "_id" : remove_id
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
    }
    // Reroute to entry_edit page if edit was requested
    else if (edit_id) {
        res.redirect("/edit_entry?id=" + edit_id);
    }
    // Reroute back to edit page with no changes.
    // Something went wrong if this is executed.
    // TODO: Add error message
    else {
        res.redirect("/edit");
    }
});

/* GET edit_entry page. */
router.get('/edit_entry', function(req, res) {
    // Retrieve ID from the URL.
    var id = req.query.id;

    var db = req.db;
    // Find entry with matching ID in database
    var collection = db.get('mapcollection');
    collection.findById( id, function(e,docs){
        res.render('edit_entry', {
            'edit_id' : id,
            'edit_entry' : docs
        });
    });
});

/* POST from '/edit_entry' form edit */
router.post('/update', function(req, res) {
    // Set our internal DB variable
    var db = req.db;

    // Get our form values. These rely on the "name" attributes
    var update_id = req.body.id;
    var update_name = req.body.name;
    var update_website = req.body.website;
    var update_email = req.body.email;
    var update_lat = req.body.lat;
    var update_lng = req.body.lng;

    // Set our collection
    var collection = db.get('mapcollection');

    // Submit updated values to the DB
    collection.update({_id : update_id,}, {
        name : update_name, 
        website : update_website,
        email : update_email,
        lat : update_lat,
        lng : update_lng
    }, function (err, doc) {
        if (err) {
            // If it failed, return error
            res.send("There was a problem updating the database.");
        }
        else {
            // Else return to original page
            res.redirect("/edit");
        }
    });
});

module.exports = router;
