
var User = require('../models/user.js');
var _    = require('underscore');
var moment  = require('moment');

exports.create = function(req, res) {
    
    var user_info = req.body;
    console.log(user_info);
    
    
    var user_document = new User(user_info);
    user_document.create_at = Date.now();
    console.log(user_document);
    
    user_document.save(function(err, doc) {
        
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
    
    User.find(query)
    .limit(limit)
    .skip(skip)
    .sort(sort)
    .select(select)
    .exec(function (err, docs) {
        
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

exports.read = function(req, res) {
    
    var objectId = req.params.id;
    User.findById(objectId, function(err, doc) {
        
        
        doc.activity = Date.now();
        console.log(doc.activity);
        console.log(moment.utc(doc.activity));
        console.log(moment().toDate());
        // console.log(Date.now());
        
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
    var objectBody = req.body;
    console.log(objectBody);
    
    objectBody.update_at = Date.now();
    var updateObject = { '$set': objectBody };
    
    User.findByIdAndUpdate(objectId, updateObject, function(err, doc) {
        
        console.log(err, doc);
        
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
    User.findByIdAndRemove(objectId, function(err) {
        
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
