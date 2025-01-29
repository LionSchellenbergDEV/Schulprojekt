const express = require("express");
const router = express.Router();
const Team = require("../models/user");


// Team hinzufügen (Form anzeigen)
router.get("/new", (req, res) => {
    res.render("teams/new");
});

// Team speichern
router.post("/", async (req, res) => {
    const { Team } = req.body;
    await Team.create({ name, players: [], elo: 1200 });
    res.redirect("/team");
});

module.exports = router;