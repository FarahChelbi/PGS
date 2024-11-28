const express = require('express');
const router = express.Router();
const contratController = require('../controllers/contratController');

router.get('/api', contratController.listContratsJSON);

// Route pour afficher la page users.ejs
router.get('/', async (req, res) => {
    try {
        const contrats = await contratController.getAllContrats();
        res.render('contrats', { contrats });
    } catch (error) {
        console.error('Error fetching contrats:', error);
        res.status(500).send('Internal Server Error');
    }
});

router.get('/ajouter_contrat', (req, res) => {
    res.render('ajouter_contrat');
});


//router.get('/', contratController.listContratsExpirantDans3Semaines);
router.post('/add-contrat', contratController.addContrat);
router.put('/update-contrat/:id', contratController.updateContrat);
router.get('/matricules', contratController.getMatricules);
//router.post('/update-contrat', contratController.updateContrat);
router.delete('/api/:id', contratController.deleteContrat);
module.exports = router;
