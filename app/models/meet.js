var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create Dates model
var Meet = new Schema({
    male:       { type: Schema.Types.ObjectId, ref: 'User', index: true, required: true },
    female:     { type: Schema.Types.ObjectId, ref: 'User', index: true, required: true },
    gender:     { type: String,  index: true, required: true },
    match:      { type: Boolean, index: true, default: false },
    read:       { type: Number, index: true, default: 0 },
    create_at:  { type: Date, index: true, default: Date.now },
    update_at:  { type: Date, index: true, default: Date.now }
});

module.exports = mongoose.model('Meet', Meet);
