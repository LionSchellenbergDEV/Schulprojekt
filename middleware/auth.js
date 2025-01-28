const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    const token = req.header('Authorization');

    if (!token) {
        return res.status(401).json({ message: 'Zugriff verweigert, kein Token vorhanden' });
    }

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified; // Nutzerdaten speichern
        next();
    } catch (err) {
        res.status(400).json({ message: 'Ungültiger Token' });
    }
};
