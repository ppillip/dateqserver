
var Heart   = require('../models/heart.js');
var User    = require('../models/user.js');
var _       = require('underscore');
var moment  = require('moment');

exports.create = function(req, res) {
    
    var object = req.body;
    var createDocument = new Heart(object);
    console.log(createDocument);
    createDocument.save(function(err, doc) {
        
        var resObject = {
            result: {},
            success: false
        };
        if (err) {
            resObject.result = err;
        } else {
            resObject.result = doc;
            resObject.success = true;
        }
        res.send(resObject);
        res.end();
        
    });
    
};

exports.lists = function(req, res) {
    
    var now = moment();
    
    console.log('time diff');
    console.log(now);
    console.log(Date.now());
    
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
    
    Heart.find(query, fields, options, function(err, docs) {
        
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
    
    User.findById(objectId, function(findErr, userObject) {
        
        var resObject = {
            result: {},
            success: false
        };
        
        if (!findErr) {
            
            userObject.activity = Date.now();
            userObject.save(function(saveErr, doc) {
                
                if (!saveErr) {
                    Heart.findById(objectId, function(err, doc) {
                        
                        if (err) {
                            resObject.result = err;
                        } else {
                            resObject.result = doc;
                            resObject.success = true;
                        }
                        res.send(resObject);
                        res.end();
                        
                    });
                } else {
                    resObject.result = saveErr;
                    res.send(resObject);
                    res.end();
                }
            });
        } else {
            resObject.result = findErr;
            res.send(resObject);
            res.end();
        }
    });
};

exports.update = function(req,res) {
    
    var objectId = req.params.id;
    
    var event = req.body['event'].toLowerCase();
    var gender = req.body['gender'].toLowerCase();
    
    Heart.findById(objectId, function(err, doc) {
        
        var resObject = {
            result: {},
            success: false
        };
        
        if (event === 'like') {
            doc.attend--;
        } else if (event === 'chat') {
            
            if (gender === 'male') {
                doc.attend = doc.attend - 5;
            } else {
                doc.attend--;
            }
            
        } else if (event === 'daily') {
            
            // 하트가 7개 미만인가?
            var heartCount = parseInt(doc.heart, 10);
            if (heartCount < 7) {
                doc.heart = 7;
                // do someshing for event
            }
            
            // 마지막 출석일로 부터 하루가 안 지났나?
            var lastCheckin = moment(doc.checkin).add('d', 1); 
            if (moment().isBefore(lastCheckin)) {
                doc.attend++;      // 연속 출석일 ++ && 연속출석인정 = 글로벌 타임이라서 미드나잇 타임 기준이 아니라 하루 기준
                
                var attendCount = parseInt(doc.attend, 10);
                
                // 출석일에 따라 하트 지급
                if (attendCount > 30) {
                    doc.heart = doc.heart + 30;
                    doc.attend = 0;
                } else if (attendCount > 15) {
                    doc.heart = doc.heart + 20;
                } else if (attendCount > 7) {
                    doc.heart = doc.heart + 15;
                } else if (attendCount > 5) {
                    doc.heart = doc.heart + 10;
                } else if (attendCount > 3) {
                    doc.heart = doc.heart + 5;
                }
                
            }
            doc.checkin = Date.now();   
            
        } else if (event === 'review') {
            doc.attend = doc.attend + 10;
        }
        
        doc.save(function(saveErr, saveDoc) {
            if (saveErr) {
                resObject.result = saveErr;
            } else {
                resObject.result = saveDoc;
                resObject.success = true;
            }
            res.send(resObject);
            res.end();
        });
        
    });
    
};

exports.destroy = function(req,res) {
    
    var objectId = req.params.id;
    Heart.findByIdAndRemove(objectId, function(err) {
        
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
