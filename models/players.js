const express = require("express");
const router = express.Router();
const Player = require("../models/user");

// Alle Spieler anzeigen
router.get("/", async (req, res) => {
    const players = await Player.find().populate("team");
    res.render("players/index", { players });
});

//Spieler hinzufuegen (Form anzeigen)
router.get("/new", (req, res) =>{
    res.render("players/new");
});

//Spieler speichern
router.post("/", async (req, res) =>{
    const newUser = new Player({username: String, email: String, password: String, elo: String, team: String});
    await newUser.save();
    res.redirect("/Player");
});

module.exports = router;