
/**
 * # DateQ Server
 * 
 * @namespace: dateq.js - Environment Configuration
 * @author: AidenJLee
 * @dependencies : package.json
 * @version: 0.0.1
 * @since: 11. 23. 2013
 * @description: Server Application의 진임접이다.
 *              환경 변수를 기반으로 Application을 설정한뒤
 *              maproute파일을 기반으로 route한다.
 * 
 * environment.js   : node.js/express/mongodb 환경 설정 및 구동하는 파일
 * maproute.js      : api routes 파일
 * 
 */

// 환경 설정
var environment = require('./environment');
var route = require('./maproute');
var info  = require('./standardinformation').information;

var feeds   = require('./app/controllers/feeds');
var _       = require('underscore');

environment.initialize(function(err, app) {
    
    if(err) { throw err; }
    
    /**
     * Standard Infomation
     */
    app.get('/v1/standardinformation', function(req, res) {
        res.send(info);
        res.end();
    });
    
    app.post('/v1/users/:id/feeds', feeds.feeds);
    app.post('/v1/users/:id/session/login', feeds.login);
    app.post('/v1/users/:id/session/logout', feeds.logout);
    
    /**
     * map route to object controller
     */
    var route_objects = ['users', 'meets', 'chats', 'blacklists', ,'hearts', 'pushs'];
    
    route_objects.forEach(function(route_name) {
        route.mapBase(app, route_name);
    });
    
    environment.run(function(err) {
        if(err) { throw err; }
    });
    
});

/** error code url : http://www.mongodb.org/about/contributors/error-codes/ **/
