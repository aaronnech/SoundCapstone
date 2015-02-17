var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
    email: { type: String, default: '' },
    password: { type: String, default: '' }
});

module.exports = mongoose.model('User', UserSchema);