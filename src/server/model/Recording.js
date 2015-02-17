var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var RecordingSchema = new Schema({
    raw : { type: [Number], required: true}
});

module.exports = mongoose.model('Recording', RecordingSchema);