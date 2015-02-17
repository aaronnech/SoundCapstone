var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
    email : { type: String, required: true, unique: true },
    password : { type: String, required: true, unique: true },
    children : {type: Schema.Types.ObjectId, ref: 'Child'}
});

module.exports = mongoose.model('User', UserSchema);