var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var RecordingSchema = new Schema({
    added : { type: Date, default: Date.now },
    raw : { type: Buffer, required: true},
    word : { type: String, required: true},
    token : { type: String, required: true},
    correctness : { type : Number, required : true}
});

module.exports = mongoose.model('Recording', RecordingSchema);