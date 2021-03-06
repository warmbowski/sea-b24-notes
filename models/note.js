var mongoose = require('mongoose');

var noteSchema = mongoose.Schema({
  noteBody: {type: String, validate: [validNoteBody, 'Too Short! Not a note.']},
  priority: {type: Number, default: 0, validate: [validPriority, 'Invalid Priority!']}
});

function validPriority(v) {
  if (v < 2 && v > -2) return v;
}

function validNoteBody(v) {
  return v.length > 3;
}

module.exports = mongoose.model('Note', noteSchema);
