const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const User = require('../models/user');

const router = express.Router();

router.get('/', authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).send('Nutzer nicht gefunden');
        }
        res.render('internal/dashboard', { user });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server-Fehler');
    }
});

router.get('/tournament', authMiddleware, (req, res) => {
    res.render('internal/tournament');
});

module.exports = router;
