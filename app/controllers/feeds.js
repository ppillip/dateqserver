
var _    = require('underscore');
var async = require('async'); 

var User = require('../models/user.js');
var Meet = require('../models/meet.js');
var Blacklist = require('../models/blacklist.js');

exports.feeds = function(req, res) {
    
    var objectId = req.params.id;
    var gender   = req.body.gender;
    var friends = req.body.lists || [];
    // var loc = req.body.loc || {};
    console.log(gender);
    
    if (!gender) {
        res.send({
            result: { error: "parameta missing" },
            success: false
        });
        res.end();
    } else {
        
        async.parallel([
            
            // parallel 1
            function(callback) {
                
                /** Meets 검색 쿼리 { 자신의 성별 : _id, match : false, gender: 반대 성별 } **/
                var query, reverse_gender;
                
                if (gender === 'male') {
                    reverse_gender  = 'female';
                    query   = { male : objectId };
                } else if (gender === 'female') {
                    reverse_gender  = 'male';
                    query   = { female : objectId };
                } else {
                    console.log('user not find');
                    callback(null);
                }
                        
                Meet
                .find(query)
                .where('match').equals(false)
                .where('gender').equals(reverse_gender)
                .where('read').lte(3)
                .limit(100)
                .sort('-activity')                      // 정렬은 최근 활동 시간 순
                .select(reverse_gender + ' -_id -__v')  // 다른 성별 정보만 보여줌
                .populate(reverse_gender)               // _id 값이아니라 정보 전체 가져옴
                .exec(function (err, meets) {
                    var result = [];
                    for (var i in meets) {
                        result.push(meets[i][reverse_gender]);
                    }
                    callback(null, result);
                });
    
            },
            
            // parallel 2
            function(callback) {
                
                async.waterfall([
                    function(cb) {
                        
                        var query = { 'reporter' : objectId };
                        
                        console.log('Feed Blick list search');
                        console.log(query);
                        
                        Blacklist
                        .find(query)
                        .select('-reporter -_id -__v -update_at -create_at')
                        .exec(function (err, blacks) {
                            
                            console.log('feed Blacklists result');
                            console.log(_.pluck(blacks, 'target'));
                            cb(null, _.pluck(blacks, 'target'));
                            
                        });
                        
                    },
                    function(blists, cb) {
                        
                        var query, reverse_gender;
                        if (gender === 'male') {
                            reverse_gender  = 'female';
                            query   = { male : objectId };
                        } else if (gender === 'female') {
                            reverse_gender  = 'male';
                            query   = { female : objectId };
                        } else {
                            console.log('user not find');
                            cb(null);
                        }
                        
                        Meet
                        .find(query)
                        .exec(function (err, meets) {
                            
                            console.log(meets);
                            var result = [];
                            for (var i in meets) {
                                result.push(meets[i][reverse_gender]);
                            }
                            cb(null, blists, result, reverse_gender);
                            
                        });
                        
                    },
                    function(blacklists, meets, r_gender, cb) {
                        
                        console.log(arguments);
                        User
                        .find({})
                        .where('_id').nin(blacklists)       // Blacklist 목록 걸러내기
                        .where('_id').nin(meets)            // 매칭중인 사람 걸러내기 (좋아요)
                        .where('facebook').nin(friends)     // facebook 친구 걸러내기
                        .where('gender').equals(r_gender)   // 다른 성별만 보여주기
                        .sort('-activity')
                        .limit(100)                         // 100 명 제한
                        .exec(cb);
                        
                    }
                ],
                function(err, results) {
                    callback(null, results);
                });
                
            }
        ],
        
        // parallel result
        function(err, results) {
            
            // console.log(results);
            var likeme = results[0] || [];
            var feedlist = results[1] || [];
            
            // console.log(err);
            var result = err;
            var success = false;
            if (!err) {
                result = { likeme: likeme, empty: feedlist }  || {};
                success = true;
            }
            res.send({
                result: result,
                success: success
            });
            res.end();
            
        });
        
    }
    
};

exports.login = function(req, res) {
    
    var object = req.body;
    var createDocument = new User(object);
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
    
};

exports.logout = function(req, res) {
    
    var object = req.body;
    var createDocument = new User(object);
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
    
};


exports.read = function(req, res) {
    
    var objectId = req.params.id;
    Meet.findById(objectId, function(err, doc) {
        
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
};

exports.update = function(req,res) {
    
    var objectId = req.params.id;
    var updateObject = { '$set': req.body };
    Meet.update({ '_id': objectId }, updateObject, function(err) {
        
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

exports.destroy = function(req,res) {
    
    var objectId = req.params.id;
    Meet.findOneAndRemove(objectId, function(err) {
        
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