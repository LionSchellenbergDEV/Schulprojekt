const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const router = express.Router();
const jwt = require('jsonwebtoken');
const renewTokenMiddleware = require('../middleware/renewTokenMiddleware');

router.use(renewTokenMiddleware); // Token-Erneuerung auf allen Routen anwenden

// GET: Registrierungsseite
router.get('/register', (req, res) => {
    res.render('register'); // Rendert views/register.ejs
});

// POST: Nutzer registrieren
router.post('/register', async (req, res) => {
    const { username, email, character, password } = req.body;
    const elo = 0;
    if (!username || !email || !password) {
        return res.status(400).send('Alle Felder sind erforderlich');
    }

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).send('E-Mail ist bereits registriert');
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({ username, email, password: hashedPassword, character, elo });
        await newUser.save();
        res.cookie("username", username);


        res.redirect('/auth/login'); // Nach der Registrierung zur Anmeldeseite
    } catch (err) {
        console.error(err);
        res.status(500).send('Server-Fehler');
    }
});

// GET: Anmeldeseite
router.get('/login', (req, res) => {
    res.render('login'); // Rendert views/login.ejs
});

// POST: Nutzer anmelden
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).send('E-Mail und Passwort sind erforderlich');
    }

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).send('Ungültige Anmeldedaten');
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).send('Ungültige Anmeldedaten');
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
        res.cookie('jwt', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 604800000,
        });

        res.redirect('/internal'); // Statt /auth/profile zum internen Bereich
    } catch (err) {
        console.error(err);
        res.status(500).send('Server-Fehler');
    }
});

const authMiddleware = require('../middleware/authMiddleware'); // Middleware zur Authentifizierung
// GET: Nutzerseite (geschützt durch Middleware)
router.get('/internal', authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).send('Nutzer nicht gefunden');
        }
        res.render('/internal/dashboard', { user });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server-Fehler');
    }
});



// POST: Nutzer aktualisieren (geschützt durch Middleware)
router.post('/profile', authMiddleware,  async (req, res) => {
    const { username, email } = req.body;
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).send('Nutzer nicht gefunden');
        }

        // Benutzer aktualisieren
        user.username = username || user.username;
        user.email = email || user.email;

        await user.save(); // Änderungen speichern
        res.redirect('/auth/profile'); // Zur Profilseite zurückkehren
    } catch (err) {
        console.error(err);
        res.status(500).send('Server-Fehler');
    }
});

// GET: Abmelden
router.get('/logout', (req, res) => {
    res.clearCookie('jwt'); // JWT-Cookie löschen
    res.redirect('/auth/login'); // Zur Login-Seite weiterleiten
});

router.get('/logout', (req, res) => {
    res.clearCookie('jwt'); // JWT-Cookie löschen
    res.redirect('/auth/login'); // Zur Login-Seite umleiten
});



// GET: Nutzer nach Namen suchen (nur für angemeldete Nutzer)
router.get('/search', async (req, res) => {
    const { username } = req.query;

    if (!username) {
        return res.status(400).send('Bitte geben Sie einen Nutzernamen ein');
    }

    try {
        const users = await User.find({ username: { $regex: username, $options: 'i' } }); // Suche nach Teilstring (case-insensitive)

        if (users.length === 0) {
            return res.status(404).send('Kein Nutzer gefunden');
        }

        res.render('searchResults', { users }); // Rendert die Suchergebnisse
    } catch (err) {
        console.error(err);
        res.status(500).send('Server-Fehler');
    }
});

//Turnier
router.get('/internal/tournament', authMiddleware, (req, res) => {
    res.render('internal/tournament');
});




module.exports = router;
