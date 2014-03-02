var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create Dates model
var Chat = new Schema({
    male:       { type: Schema.Types.ObjectId, ref: 'User', index: true, required: true },
    female:     { type: Schema.Types.ObjectId, ref: 'User', index: true, required: true },
    fbopenm:    { type: Boolean, default: false },
    fbopenf:    { type: Boolean, default: false },
    state:      { type: Boolean, default: true },
    create_at:  { type: Date, index: true, default: Date.now },
    update_at:  { type: Date, index: true, default: Date.now }
});

module.exports = mongoose.model('Chat', Chat);
