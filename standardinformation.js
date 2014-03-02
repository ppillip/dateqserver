
module.exports = {
    information: {
        baseURL: 'http://54.199.152.190',
        basic: {
            'users': '/v1/users',
            'meets': '/v1/meets',
            'chats': '/v1/chats',
            'hearts': '/v1/hearts',
            'blacklists': '/v1/blacklists',
            'pushs': '/v1/pushs'
            },
        extend: {
            'login':  '/v1/users/:id/session/login',
            'logout': '/v1/users/:id/session/logout',
            'feeds':  '/v1/users/:id/feeds'
        },
        chatinfo : {
            Subscribe :	'sub-c-380f3ab2-78d7-11e3-b060-02ee2ddab7fe',
            Publish :	'pub-c-9472857d-46b8-4a56-b4f7-bc67050871e1',
            Secret :    'sec-c-ODhjZDNlMTktNDk2Ny00YzI2LWJkODgtMzJhNGY2YzhjMTU4'
        },
        forceVersion: '1.0.0',
        currentVersion: '1.0.0',
        itunesURL: '',
        googleplayURL: '',
        notice : {
            system : [],
            infomation : [],
        }
    }
};
