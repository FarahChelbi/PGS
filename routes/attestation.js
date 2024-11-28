const express = require('express');
const router = express.Router();
const attestationController = require('../controllers/attestationController');

router.post('/generate-attestation/:type', attestationController.generateAttestation);

// Route pour l'attestation:
router.get('/attestation', (req, res) => {
    res.render('attestation');
});

module.exports = router;  // Exporte correctement le routeur
