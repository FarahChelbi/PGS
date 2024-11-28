const express = require('express');
const path = require('path'); // Importer le module path
const router = express.Router();
const authController = require('../controllers/authController');

// Route pour afficher la page d'authentification
router.get('/', (req, res) => { // Route relative à /auth
    res.render('auth'); // Utiliser res.render pour les fichiers EJS
});

router.post('/register', authController.register);
router.post('/login', authController.login);

module.exports = router;