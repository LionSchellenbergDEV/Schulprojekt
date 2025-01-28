const jwt = require('jsonwebtoken');

function authMiddleware(req, res, next) {
    const token = req.cookies.jwt; // JWT-Token aus Cookies lesen

    if (!token) {
        return res.status(401).json({ message: 'Zugriff verweigert, kein Token vorhanden' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET); // Token überprüfen
        req.user = decoded; // Benutzerinformationen (z. B. ID) in `req.user` speichern
        next(); // Nächster Middleware-Schritt
    } catch (err) {
        console.error('Ungültiges Token:', err);
        res.status(401).json({ message: 'Zugriff verweigert, ungültiges Token' });
    }
}

module.exports = authMiddleware;
