
/**
 * # DateQ Server ROutes
 * 
 * @namespace: maproute.js - routes
 * @author: AidenJLee
 * @description: API를 route하는 곳이다.
 * restful API를 기반으로 route하며 그 외의 API는 extends를 통해 한다.
 * 
 */

exports.mapBase = function(app, route_name) {
    
    var route_object = require('./app/controllers/' + route_name);
    var route_URI = '/v1/' + route_name;
    
    app.post(route_URI, route_object.create);          // create
    app.get(route_URI, route_object.lists);            // lists
    app.get(route_URI + '/:id?', route_object.read);   // read
    app.put(route_URI + '/:id', route_object.update);  // update
    app.del(route_URI + '/:id', route_object.destroy); // destroy
    
};

