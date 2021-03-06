var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ChildSchema = new Schema({
    _therapist : {type: Schema.Types.ObjectId, ref: 'User'},
    name : { type: String, required: true},
    token : { type: String, required: true},
    recordings : [{type: Schema.Types.ObjectId, ref: 'Recording'}]
});

module.exports = mongoose.model('Child', ChildSchema);