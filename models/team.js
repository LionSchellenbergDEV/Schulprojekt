const mongoose = require("mongoose");

const TeamSchema = new mongoose.Schema({
    name: String,
    players: [{ type: mongoose.Schema.Types.ObjectId, ref: "Player" }],
    elo: Number
});

module.exports = mongoose.model("Team", TeamSchema);