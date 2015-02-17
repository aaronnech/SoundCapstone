var Child = require('../model/Child');
var Recording = require('../model/Recording');

// Middleware that checks for the existence of a childId
// In the request.
exports.hasChildId = function(req, res, next) {
    if (req.body.childId) {
        next();
    } else {
        console.log('no child id!');
        res.json({error : 'No child id'});
    }
};

// Adds a recording
exports.add = function(req, res) {
    Child.findOne({_id : req.body.childId}, function(err, child) {
        if (err || !child) {
            console.log(err);
            res.json({error : 'Error saving recording'});
        } else {
            var recording = new Recording({
                'raw' : req.body.raw
            });

            // Push recording into child and save
            child.recordings.push(recording);
            child.save(function(err) {
                if (err) {
                    console.log(err);
                    res.json({error: 'Error saving recording'});
                } else {
                    res.json({success : true});
                }
            })
        }
    });
};