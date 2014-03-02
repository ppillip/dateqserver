
var Meet = require('../models/meet.js');
var _    = require('underscore');


exports.create = function(req, res) {
    
    var object = req.body;
    
    var meetQuery = { male: object.male, female: object.female };
    
    console.log('meetQuery');
    console.log(meetQuery);
    
    Meet
    .find(meetQuery)
    .exec(function (err, meet) {
        
        console.log(meet);
        console.log(meet.length);
        if (meet.length) {
            
            console.log(meet[0]._id);
            Meet.findByIdAndUpdate(meet[0]._id, { match: true }, function (err, saveMeet) {
                
                var result = err;
                var success = false;
                if (!err) {
                    result = saveMeet;
                    success = true;
                }
                res.send({
                    result: result,
                    success: false
                });
                res.end();
                
            });
            
        } else {
            
            var createDocument = new Meet(object);
            console.log(createDocument);
            createDocument.save(function(err, doc) {
                
                console.log(err);
                var result = err;
                var success = false;
                if (!err) {
                    result = doc;
                    success = true;
                }
                res.send({
                    result: result,
                    success: success
                });
                res.end();
                
            });
            
        }
    });
    
};

exports.lists = function(req, res) {
    
    // some query filter
    var filter = ['limit','sort','fields','skip','explain','select'];
    var query  = _.omit(req.query, filter) || {};

    // make options
    var limit  = parseInt(req.query.limit, 10) || 100;
    var skip   = parseInt(req.query.skip, 10) || 0;

    // make fields
    var select = req.query.select || '';
    var sort   = req.query.sort || '';
    
    Meet.find(query)
    .limit(limit)
    .skip(skip)
    .sort(sort)
    .select(select)
    .exec(function (err, docs) {
        
        console.log(err);
        console.log(docs);
        var result = {};
        var success = false;
        if (err) {
            result = err;
        } else {
            result = docs;
            success = true;
        }
        res.send({
            result: result,
            success: success
        });
        res.end();

    });
    
};

// show a widget
exports.read = function(req, res) {
    
    var objectId = req.params.id;
    Meet.findById(objectId).populate('male female').exec( function(err, doc) {
        
        var result = {};
        var success = false;
        if (err) {
            result = err;
        } else {
            result = doc;
            success = true;
        }
        res.send({
            result: result,
            success: success
        });
        res.end();
        
    });
    
};

exports.update = function(req,res) {
    
    var objectId = req.params.id;
    var updateObject = { '$set': req.body };
    Meet.findByIdAndUpdate(objectId, updateObject, function(err, doc) {
        
        var result = {};
        var success = false;
        if (err) {
            result = err;
        } else {
            result = doc;
            success = true;
        }
        res.send({
            result: result,
            success: success
        });
        res.end();
        
    });
    
};

exports.destroy = function(req,res) {
    
    var objectId = req.params.id;
    Meet.findByIdAndRemove(objectId, function(err) {
        
        var success = false;
        if (!err) {
            success = true;
        }
        res.send({
            success: success
        });
        res.end();
        
    });
    
};
