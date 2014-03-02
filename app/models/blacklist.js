var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create Dates model
var Blacklist = new Schema({
    reporter: { type: Schema.Types.ObjectId, ref: 'User', index: true, required: true },
    target:   { type: Schema.Types.ObjectId, ref: 'User', index: true, required: true },
    create_at:  { type: Date, index: true, default: Date.now },
    update_at:  { type: Date, index: true, default: Date.now }
});

module.exports = mongoose.model('Blacklist', Blacklist);