const mongoose = require('mongoose');


// User Schema
const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    character: { type: String, required: true },
    password: { type: String, required: true },
    elo: { type: Number, required: true },
});
/* User Schema (Giulio) (funktioniert nicht, bzw. es wird nur username und email gespeichert)
const UserSchema = new mongoose.Schema({
    username: String,
    firstname: String,
    lastname: String,
    email: String,
    position: String,
    elo: Number,
    team: { type: mongoose.Schema.Types.ObjectId, ref: "Team" }
});*/

module.exports = mongoose.model('User', UserSchema);
