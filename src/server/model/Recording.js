var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var RecordingSchema = new Schema({
    _therapist : {type: Schema.Types.ObjectId, ref: 'User'},
    added : { type: Date, default: Date.now },
    raw : { type: Buffer, required: true},
    word : { type: String, required: true}
});

module.exports = mongoose.model('Recording', RecordingSchema);