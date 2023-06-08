const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  expireDate: { type: Date, required: true }
});

const Session = mongoose.model('Session', sessionSchema);

module.exports = Session;
