const jwt = require('jsonwebtoken');

// Middleware-Funktion
const renewTokenMiddleware = (req, res, next) => {
    const token = req.cookies.jwt; // JWT aus Cookies lesen
    if (!token) return next(); // Wenn kein Token vorhanden, weiter zur nächsten Middleware

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Prüfen, ob das Token bald abläuft (z. B. weniger als 7 Tage übrig)
        const now = Math.floor(Date.now() / 1000);
        if (decoded.exp - now < 7 * 24 * 60 * 60) { // Weniger als 7 Tage
            const newToken = jwt.sign({ id: decoded.id }, process.env.JWT_SECRET, { expiresIn: '30d' });
            res.cookie('jwt', newToken, {
                httpOnly: true, // Cookie ist nur vom Server zugänglich
                secure: process.env.NODE_ENV === 'production', // HTTPS in Produktion
                maxAge: 30 * 24 * 60 * 60 * 1000, // 30 Tage
            });
        }
    } catch (err) {
        console.error('Fehler bei der Token-Erneuerung:', err);
    }

    next(); // Weiter zur nächsten Middleware oder Route
};

// Funktion exportieren
module.exports = renewTokenMiddleware;
