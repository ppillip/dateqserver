var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create Dates model
var Heart = new Schema({
    heart:  { type: Number, default: 0 },
    attend: { type: Number, default: 0 },
    checkin:{ type: Date, index: true, default: Date.now },
    create_at:  { type: Date, index: true, default: Date.now },
    update_at:  { type: Date, index: true, default: Date.now }
});

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

Heart.pre('save', function(next) {
    console.log('save pre');
    return next();
});

Heart.pre('remove', function(next) {
    console.log('remove pre');
    return next();
});


/**
 * Post middleware
 */

Heart.post('save', function (doc) {
    console.log('%s has been saved', doc._id);
});

/**
 * Methods
 */

Heart.methods = {
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

module.exports = mongoose.model('Heart', Heart);
