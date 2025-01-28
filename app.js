const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const path = require('path');
const cookieParser = require('cookie-parser'); // Cookie-Parser importieren
dotenv.config();
const app = express();

// Middleware
app.use(cookieParser()); // Cookie-Parser aktivieren
app.use(express.json()); // JSON-Parser aktivieren
app.use(express.urlencoded({ extended: true })); // URL-encoded Daten parsen
app.use(bodyParser.urlencoded({ extended: false })); // Formulardaten parsen
app.use(express.static(path.join(__dirname, 'public'))); // Statische Dateien
app.set('view engine', 'ejs'); // EJS als Template-Engine setzen

// MongoDB-Verbindung
mongoose
    .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch((err) => console.error('MongoDB connection error:', err));

// Routen
const authRoutes = require('./routes/auth');
app.use('/auth', require('./routes/auth')); // Routen importieren


// Startseite (Landing Page)
app.get('/', (req, res) => {
    res.render('index'); // Rendert die Datei views/index.ejs
});

// Server starten
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server läuft auf Port ${PORT}`));
