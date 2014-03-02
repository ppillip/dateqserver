
var Chat = require('../models/chat.js');
var _    = require('underscore');

exports.create = function(req, res) {
    
    var object = req.body;
    var query  = { 'male': object.male, 'female': object.female };
    Chat.find(query, function(err, docs) {
        
        if (!docs.length) {
            var createDocument = new Chat(object);
            console.log(createDocument);
            createDocument.save(function(err, doc) {
                
                var result = {};
                var success = false;
                if (err) {
                    console.log(err);
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
        }
        
    });
    
};

exports.lists = function(req, res) {
    
    // some query filter
    var filter = ['limit','sort','fields','skip','explain'];
    var query = _.omit(req.query, filter) || {};
    
    // make fields
    var fields = _.pick(req.query, 'fields') || {};
    
    // make options
    var limit  = parseInt(req.query.limit, 10) || 0;
    var skip   = parseInt(req.query.skip, 10) || 0;
    var options = {
        limit: limit,
        skip: skip
    };
    
    Chat.find(query, fields, options, function(err, docs) {
        
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
    Chat.findById(objectId, function(err, doc) {
        
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
    Chat.findByIdAndUpdate(objectId, updateObject, function(err, doc) {
        
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
    Chat.findByIdAndRemove(objectId, function(err) {
        
        var success = false;
        if (err) { } else {
            success = true;
        }
        res.send({
            success: success
        });
        res.end();
        
    });
};
