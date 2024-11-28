const express = require('express');
const router = express.Router();
const contratController = require('../controllers/contratController');



router.get('/', async (req, res) => {
    try {
        const contratsExp = await contratController.listContratsExpirantDans3Semaines();
        res.render('contrats_expires', { contratsExp });
    } catch (error) {
        console.error('Error fetching contrats:', error);
        res.status(500).send('Internal Server Error');
    }
});



module.exports = router;
