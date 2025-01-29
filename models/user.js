const mongoose = require('mongoose');

// User Schema
const UserSchema = new mongoose.Schema({
    username: String,
    firstname: String,
    lastname: String,
    email: String,
    position: String,
    elo: Number,
    team: { type: mongoose.Schema.Types.ObjectId, ref: "Team" }
});

module.exports = mongoose.model('Player', UserSchema);
