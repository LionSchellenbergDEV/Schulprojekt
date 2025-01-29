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
    const { username, email, password } = req.body;

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

        const newUser = new User({ username, email, password: hashedPassword });
        await newUser.save();
        document.cookie = "username=" + username;

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

        // JWT-Token generieren
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        // Token in Cookie speichern
        res.cookie('jwt', token, {
            httpOnly: true, // Cookie kann nur vom Server gelesen werden
            secure: process.env.NODE_ENV === 'production', // Nur in HTTPS (wenn production)
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 Tage
        });

        res.redirect('/auth/profile'); // Weiterleitung zur geschützten Nutzerseite
    } catch (err) {
        console.error(err);
        res.status(500).send('Server-Fehler');
    }
});
// GET: Nutzerseite (geschützt durch Middleware)
router.get('/profile',  async (req, res) => {
    try {
        const user = await User.findById(req.user.id); // Nutzer anhand der ID im Token abrufen
        if (!user) {
            return res.status(404).send('Nutzer nicht gefunden');
        }
        res.render('profile', { user }); // Daten an die EJS-Ansicht übergeben
    } catch (err) {
        console.error(err);
        res.status(500).send('Server-Fehler');
    }
});

// POST: Nutzer aktualisieren (geschützt durch Middleware)
router.post('/profile',  async (req, res) => {
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
module.exports = router;
