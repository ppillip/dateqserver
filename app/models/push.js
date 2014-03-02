
/**
 * Push Server에서 사용중이니
 * 절대 변경하지 마시오.
 * 변경 시 책임질 수 없음.
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create Dates model
var Push = new Schema({
    _id:    { type: Schema.Types.ObjectId, ref: 'User', index: true, required: true },
    os:     { type: String },
    token : { type: String },
    enable: { type: Boolean, default: true },
    create_at:  { type: Date, index: true, default: Date.now },
    update_at:  { type: Date, index: true, default: Date.now }
});

module.exports = mongoose.model('Push', Push);
