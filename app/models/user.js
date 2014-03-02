var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var crypto = require('crypto');

// var safe = { w: "majority", wtimeout: 3000 };

// create User model
var User = new Schema({
    facebook:   { type: String, index: true, required: true, unique: true, trim: true }, 
    email:      { type: String, index: true, trim: true },
    username:   { type: String, index: true, required: true },
    gender:     { type: String, index: true, required: true },
    
    link:       { type: String },
    birthday:   { type: String },
    address:    { type: String },
    education:  [Schema.Types.Mixed],
    work:       [Schema.Types.Mixed],
    likes:      [Schema.Types.Mixed],
    
    likestate:  { type: String, default: 'empty' },
    profiles:   { 
        one:    { type: String, default: "" },
        two:    { type: String, default: "" },
        three:  { type: String, default: "" },
        four:   { type: String, default: "" },
        five:   { type: String, default: "" } 
    },
    intro:      { type: String },
    loc: {
      lat: { type: String, default: "" }, 
      lon: { type: String, default: "" }
    },
    blacklists: [String],
    
    activity:   { type: Date, index: true, default: Date.now },
    create_at:  { type: Date, index: true, default: Date.now },
    update_at:  { type: Date, index: true, default: Date.now }
    
}, { safe: true });

/**
 * Validations
 */

var validatePresenceOf = function (value) {
    return value && value.length;
};

/**
 * Pre-save hook
 * use case - 1.init 2.validate 3.save 4.remove
 */

User.pre('save', function(next) {
    console.log('save pre');
    User.update_at = Date.now();
    return next();
});

User.pre('remove', function(next) {
    console.log('remove pre');
    return next();
});


/**
 * Post middleware
 */

User.post('save', function (doc) {
    console.log('%s has been saved', doc._id);
});

/**
 * Methods
 */

User.methods = {
    /**
    * Update time
    *
    * @return { User info}
    * @api public
    */
    updateAt: function () {
        this.update_at = Date.now;
    },
   
  /**
   * Authenticate - check if the passwords are the same
   *
   * @param {String} plainText
   * @return {Boolean}
   * @api public
   */
    
    authenticate: function (plainText) {
        return this.encryptPassword(plainText) === this.hashed_password;
    },

  /**
   * Make salt
   *
   * @return {String}
   * @api public
   */
    
    makeSalt: function () {
        console.log('call salt method');
        return Math.round((new Date().valueOf() * Math.random())) + '';
    },

  /**
   * Encrypt password
   *
   * @param {String} password
   * @return {String}
   * @api public
   */
    
    encryptPassword: function (password) {
        if (!password) {
            return '';
        }
        var encrypred;
        try {
            encrypred = crypto.createHmac('sha1', this.salt).update(password).digest('hex');
            return encrypred;
        } catch (err) {
            return '';
        }
    }
};

module.exports = mongoose.model('User', User);
