const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const db = require('../config/database');

// Route pour obtenir la liste des utilisateurs en JSON (API)
router.get('/api', userController.listUsersJSON);

// Route pour afficher la page users.ejs
router.get('/', async (req, res) => {
    try {
        const users = await userController.getAllUsers();
        res.render('users', { users });
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).send('Internal Server Error');
    }
});

router.delete('/api/:id', userController.deleteUser);

router.get('/ajouter_employe', (req, res) => {
    res.render('ajouter_employe');
});
router.post('/add-employe', userController.addUser);



router.get('/get-employee/:id', userController.getEmployee);

// Route pour mettre à jour un employé par ID
router.put('/update-employee/:id', userController.updateEmployee);





module.exports = router;
