process.env.NODE_ENV = 'development'; //'production';
process.env.PORT = 80;
process.env.HOST = '172.31.29.183';
process.env.MONGO_URL = 'mongodb://172.31.11.166/dateq';

/**
 * # DateQ Server Environment
 * 
 * @namespace: environment.js - Environment Configuration
 * @author: AidenJLee
 * @description: Server의 환경을 지정하는 곳이다.
 *               환경 변수를 기반으로 Application을 설정한다.
 */

var express = require('express'),
    app     = express(),
    server  = require('http').createServer(app);
var path = require('path');
var mongoose = require('mongoose');


// Application HOST, PORT, MongoDB URL등의 설정
var APP_HOST = process.env.HOST || '172.31.29.183';
var APP_PORT = process.env.PORT || 8080;
var MONGO_URL = process.env.MONGO_URL || 'mongodb://localhost/dateq';


// MongoDB Options
var options = {
    db: { native_parser: true },
    server: { poolSize: 4 },
    replset: { rs_name: 'dateqReplSet' }
    // user: 'myUserName',
    // pass: 'myPassword'
};
options.server.socketOptions = options.replset.socketOptions = { keepAlive: 1 };

// Express 환경 설정
var initialize = function(callback) {
    
    app.configure(function() {
        // all environments
        app.set('port', APP_PORT || process.env.PORT );
        app.set('views', path.join(__dirname, 'views'));
        app.set('view engine', 'jade');
        app.use(express.favicon());
        app.use(express.logger('dev'));
        app.use(express.bodyParser());
        // app.use(express.urlencoded());
        // app.use(express.json());
        app.use(express.methodOverride());
        app.use(app.router);
    });
    
    // 개발용 로거 및 예외처리
    app.configure('development', function() {
        app.use(express.logger('dev'));
        app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
    });
    
    // 실제 환경에서 로거 및 예외처리
    app.configure('production', function() {
        app.use(express.logger());
        app.use(express.errorHandler());
    });

    // expressjs 컨텍스트를 잃지 않기 위해 middleware에서 exception 처리
    app.use(function(err, req, res, next) {
        console.log('expressjs =============================================');
        console.error(err.stack);
        res.statusCode = 500;
        res.send('Something broke!');
    });
    
    // MongoDB와 연결 후 db 레퍼런스 정보를 담는다.
    mongoose.connect(MONGO_URL, options);
    mongoose.connection.on('open', function(err) {
        if(err) {
            return callback(err);
        }
        console.log('Connected to Mongoose');
        callback(null, app);
    });
    
};

var run = function(callback) {
    // 서버 구동
    server.listen(APP_PORT, APP_HOST, function(err) {
        if (err) {
            mongoose.connection.on('close');
            console.log('Disconnected to Mongoose');
            return callback(err);
        }
        
        console.log("Server is Working! - v" + require('./package.json').version);
        console.log("listening on port " + APP_PORT + " and host " + APP_HOST);
        
        callback(null);
    });
};

exports.initialize = initialize;
exports.run = run;
