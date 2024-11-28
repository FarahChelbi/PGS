const express = require('express');
const router = express.Router();
const serviceController = require('../controllers/serviceController');

router.get('/api', serviceController.listServicesJSON);

// Route pour afficher la page users.ejs
router.get('/', async (req, res) => {
    try {
        const services = await serviceController.getAllServices();
        res.render('services', { services });
    } catch (error) {
        console.error('Error fetching services:', error);
        res.status(500).send('Internal Server Error');
    }
});



router.delete('/api/:id', serviceController.deleteService);

router.get('/ajouter_service', (req, res) => {
    res.render('ajouter_service');
});
router.post('/add-service', serviceController.addService);


module.exports = router;
